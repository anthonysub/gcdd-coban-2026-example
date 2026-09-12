const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'raffles.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Persistencia ----------
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ raffles: {} }, null, 2));
}

function readDB() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeDB(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function newId() {
  return crypto.randomBytes(6).toString('hex');
}

// ---------- Configuración por defecto de una rifa ----------
function defaultConfig() {
  return {
    winnersCount: 1,
    allowRepeatWinners: false,
    removeWinnerAfterDraw: true,
    spinDurationMs: 6000,
    minSpins: 5,
    theme: 'classic',
    soundEnabled: true,
  };
}

// ---------- Selección ponderada ----------
function weightedPick(participants) {
  const total = participants.reduce((sum, p) => sum + (p.tickets || 1), 0);
  let rand = Math.random() * total;
  for (const p of participants) {
    rand -= (p.tickets || 1);
    if (rand <= 0) return p;
  }
  return participants[participants.length - 1];
}

// ================= RUTAS API =================

// Listar rifas
app.get('/api/raffles', (req, res) => {
  const db = readDB();
  const list = Object.values(db.raffles).map((r) => ({
    id: r.id,
    name: r.name,
    createdAt: r.createdAt,
    participantsCount: r.participants.length,
    winnersCount: r.winners.length,
  }));
  res.json(list);
});

// Crear rifa
app.post('/api/raffles', (req, res) => {
  const { name, config } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'El nombre de la rifa es requerido' });

  const db = readDB();
  const id = newId();
  db.raffles[id] = {
    id,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    config: { ...defaultConfig(), ...(config || {}) },
    participants: [],
    winners: [],
  };
  writeDB(db);
  res.status(201).json(db.raffles[id]);
});

// Obtener rifa
app.get('/api/raffles/:id', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });
  res.json(raffle);
});

// Actualizar rifa (nombre y/o configuración)
app.put('/api/raffles/:id', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });

  const { name, config } = req.body;
  if (name && name.trim()) raffle.name = name.trim();
  if (config) raffle.config = { ...raffle.config, ...config };

  writeDB(db);
  res.json(raffle);
});

// Eliminar rifa
app.delete('/api/raffles/:id', (req, res) => {
  const db = readDB();
  if (!db.raffles[req.params.id]) return res.status(404).json({ error: 'Rifa no encontrada' });
  delete db.raffles[req.params.id];
  writeDB(db);
  res.json({ ok: true });
});

// Agregar participante
app.post('/api/raffles/:id/participants', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });

  const { name, tickets } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'El nombre del participante es requerido' });

  const participant = {
    id: newId(),
    name: name.trim(),
    tickets: Number(tickets) > 0 ? Number(tickets) : 1,
  };
  raffle.participants.push(participant);
  writeDB(db);
  res.status(201).json(participant);
});

// Agregar participantes en bloque (uno por línea, formato "Nombre" o "Nombre,tickets")
app.post('/api/raffles/:id/participants/bulk', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Se requiere el texto con los participantes' });

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const added = [];
  for (const line of lines) {
    const [rawName, rawTickets] = line.split(',').map((s) => s && s.trim());
    if (!rawName) continue;
    const participant = {
      id: newId(),
      name: rawName,
      tickets: Number(rawTickets) > 0 ? Number(rawTickets) : 1,
    };
    raffle.participants.push(participant);
    added.push(participant);
  }
  writeDB(db);
  res.status(201).json(added);
});

// Eliminar participante
app.delete('/api/raffles/:id/participants/:pid', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });

  const before = raffle.participants.length;
  raffle.participants = raffle.participants.filter((p) => p.id !== req.params.pid);
  if (raffle.participants.length === before) return res.status(404).json({ error: 'Participante no encontrado' });

  writeDB(db);
  res.json({ ok: true });
});

// Vaciar participantes
app.delete('/api/raffles/:id/participants', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });
  raffle.participants = [];
  writeDB(db);
  res.json({ ok: true });
});

// Realizar el sorteo: el servidor elige al ganador (para trazabilidad) y el
// frontend anima la ruleta hasta detenerse en el índice indicado.
app.post('/api/raffles/:id/draw', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });

  if (raffle.participants.length === 0) {
    return res.status(400).json({ error: 'No hay participantes para sortear' });
  }

  if (!raffle.config.allowRepeatWinners && raffle.participants.length === 0) {
    return res.status(400).json({ error: 'No quedan participantes disponibles' });
  }

  const winner = weightedPick(raffle.participants);
  const winnerIndex = raffle.participants.findIndex((p) => p.id === winner.id);

  const winnerRecord = {
    participantId: winner.id,
    name: winner.name,
    drawnAt: new Date().toISOString(),
  };
  raffle.winners.push(winnerRecord);

  if (raffle.config.removeWinnerAfterDraw) {
    raffle.participants.splice(winnerIndex, 1);
  }

  writeDB(db);
  res.json({
    winner: winnerRecord,
    winnerIndex,
    remainingParticipants: raffle.participants,
  });
});

// Reiniciar historial de ganadores (no restaura participantes eliminados)
app.post('/api/raffles/:id/reset-winners', (req, res) => {
  const db = readDB();
  const raffle = db.raffles[req.params.id];
  if (!raffle) return res.status(404).json({ error: 'Rifa no encontrada' });
  raffle.winners = [];
  writeDB(db);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`🎡 Ruleta de sorteos escuchando en http://localhost:${PORT}`);
});
