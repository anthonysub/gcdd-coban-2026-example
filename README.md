# 🎡 Ruleta de Sorteos

> Demo desarrollada para el evento **GitHub Copilot Dev Days**.

Aplicativo web en Node.js para realizar rifas y sorteos mediante una ruleta interactiva, con soporte para múltiples rifas configurables de forma independiente.

## Características

- **Múltiples rifas**: crea, selecciona y elimina distintas rifas, cada una con sus propios participantes, configuración e historial de ganadores.
- **Participantes ponderados**: cada participante puede tener uno o más "boletos" (tickets), lo que aumenta su probabilidad de ganar proporcionalmente.
- **Alta individual o en bloque**: agrega participantes de uno en uno o pega una lista de texto (`Nombre` o `Nombre,tickets` por línea).
- **Configuración por rifa**:
  - Duración del giro de la ruleta (segundos).
  - Permitir o no que un ganador pueda repetir.
  - Quitar o no al ganador de la ruleta tras cada sorteo.
  - Tema visual de colores (Clásico, Atardecer, Océano, Monocromo).
- **Sorteo trazable**: el servidor selecciona al ganador (ponderado según los boletos) y el frontend anima la ruleta hasta detenerse exactamente en esa porción.
- **Historial de ganadores**: registro con fecha/hora de cada sorteo, con opción de limpiarlo.
- **Persistencia**: toda la información se guarda en un archivo JSON local (`data/raffles.json`), sin necesidad de base de datos.

## Tecnologías

- **Backend**: Node.js + [Express](https://expressjs.com/)
- **Frontend**: HTML, CSS y JavaScript puro (sin frameworks), con la ruleta dibujada en `<canvas>`
- **Persistencia**: archivo JSON en disco (`data/raffles.json`)

## Estructura del proyecto

```
gcdd-coban-2026/
├── server.js              # Servidor Express y API REST
├── package.json
├── data/
│   └── raffles.json       # Persistencia de rifas (se crea automáticamente)
└── public/
    ├── index.html          # Interfaz principal
    ├── styles.css          # Estilos
    └── app.js              # Lógica del cliente y animación de la ruleta
```

## Requisitos previos

- [Node.js](https://nodejs.org/) versión 18 o superior (incluye npm)

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Inicia el servidor:

   ```bash
   npm start
   ```

   Para desarrollo, con recarga automática al detectar cambios:

   ```bash
   npm run dev
   ```

3. Abre tu navegador en:

   ```
   http://localhost:3000
   ```

   El puerto puede cambiarse definiendo la variable de entorno `PORT` antes de iniciar el servidor.

## Uso básico

1. Crea una nueva rifa desde el panel izquierdo indicando su nombre.
2. Agrega participantes desde el panel derecho (individualmente o en bloque) y, opcionalmente, asígnales más de un boleto para aumentar su probabilidad.
3. Ajusta la configuración de la rifa (duración del giro, repetición de ganadores, eliminación tras sorteo, tema visual) y guarda los cambios.
4. Pulsa **"Girar Ruleta 🎯"** para realizar el sorteo; el ganador se resalta en pantalla y queda registrado en el historial.

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/raffles` | Lista todas las rifas |
| POST | `/api/raffles` | Crea una nueva rifa |
| GET | `/api/raffles/:id` | Obtiene el detalle de una rifa |
| PUT | `/api/raffles/:id` | Actualiza nombre y/o configuración |
| DELETE | `/api/raffles/:id` | Elimina una rifa |
| POST | `/api/raffles/:id/participants` | Agrega un participante |
| POST | `/api/raffles/:id/participants/bulk` | Agrega participantes en bloque |
| DELETE | `/api/raffles/:id/participants/:pid` | Elimina un participante |
| DELETE | `/api/raffles/:id/participants` | Vacía todos los participantes |
| POST | `/api/raffles/:id/draw` | Realiza el sorteo y devuelve al ganador |
| GET | `/api/raffles/:id/winners/export` | Descarga el historial de ganadores en formato CSV |
| POST | `/api/raffles/:id/reset-winners` | Limpia el historial de ganadores |

## Notas

- Los datos se almacenan localmente en `data/raffles.json`; elimina este archivo para reiniciar todo el estado de la aplicación.
- No requiere configuración adicional ni servicios externos para funcionar.
