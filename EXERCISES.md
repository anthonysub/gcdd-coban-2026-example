# 🤖 Ejercicios: GitHub Copilot Coding Agent (Cloud Agent)

Esta guía contiene ejercicios prácticos para aprender a trabajar con el **GitHub Copilot coding agent** (agente en la nube) sobre el proyecto **Ruleta de Sorteos**. El repositorio ya está configurado con el servidor MCP de GitHub (`.vscode/mcp.json`) y sigue el flujo de ramas **Git Flow** descrito en [CONTRIBUTING.md](./CONTRIBUTING.md).

## Requisitos previos

- Tener acceso al repositorio [github.com/yovafree/gcdd-coban-2026](https://github.com/yovafree/gcdd-coban-2026).
- Licencia de GitHub Copilot con acceso al *coding agent* (cloud agent).
- VS Code con el chat de Copilot abierto en este workspace (el MCP de GitHub ya está configurado).

## Flujo general de cada ejercicio

1. **Pide la tarea** en el chat de Copilot (asignar un issue o delegar directamente una tarea).
2. El **agente trabaja en la nube** sobre una rama nueva y abre un **Pull Request**.
3. Se solicita una **revisión de código automática** de Copilot sobre el PR.
4. Se revisan los comentarios, se ajusta si es necesario y se fusiona a `develop`.

---

## Ejercicio 1 — Primer contacto: tarea sencilla delegada directamente

**Objetivo:** delegar una tarea simple al agente sin pasar por un issue.

> Pide en el chat: *"Crea un PR con Copilot que agregue un botón para exportar el historial de ganadores a CSV"*

**Pasos esperados:**
1. Copilot usa `create_pull_request_with_copilot` indicando `owner`, `repo`, `title` y `problem_statement`.
2. El agente abre un PR con la implementación sobre una rama nueva (base `develop`).
3. Solicita la revisión automática con `request_copilot_review`.
4. Revisa los comentarios de la revisión y valida los cambios propuestos.

---

## Ejercicio 2 — Crear un issue y asignarlo al agente

**Objetivo:** practicar el flujo issue → agente → PR.

1. Crea un issue en el repositorio titulado *"Agregar modo oscuro/claro a la interfaz"* con una descripción clara de lo que se espera.
2. Pide en el chat: *"Asigna Copilot al issue #N para que lo resuelva"*.
3. Copilot usa `assign_copilot_to_issue` (indicando `issue_number`).
4. Espera a que el agente abra el Pull Request asociado al issue.
5. Solicita revisión automática con Copilot antes de fusionar.

---

## Ejercicio 3 — Nueva forma de configuración de la rifa

**Objetivo:** extender las reglas de configuración del sorteo usando el agente.

> Tarea sugerida: *"Agrega una nueva opción de configuración que permita definir una cuenta regresiva sonora antes de detenerse la ruleta"*

**Pasos:**
1. Delega la tarea al agente (`create_pull_request_with_copilot` o vía issue).
2. Indica en el `problem_statement` o en el issue el detalle: dónde se agrega la opción (`config.js`, `server.js`, panel de configuración), y que debe respetar el resto de configuraciones existentes (duración del giro, repetición de ganadores, etc.).
3. Cuando el PR esté listo, solicita revisión con `request_copilot_review`.
4. Verifica que los cambios no rompan la selección ponderada de participantes.

---

## Ejercicio 4 — Corrección de errores (bugfix)

**Objetivo:** simular un flujo de `bugfix/*` con el agente.

1. Introduce (o identifica) un error real o simulado, por ejemplo: *"Si un participante tiene 0 boletos, la ruleta puede fallar al dibujar la porción"*.
2. Crea un issue describiendo el bug con pasos para reproducirlo.
3. Asigna el issue al agente con `assign_copilot_to_issue`.
4. Verifica que el PR resultante:
   - Corrige el problema.
   - No introduce regresiones en el resto de la ruleta.
5. Solicita la revisión automática y confirma que Copilot valida la corrección.

---

## Ejercicio 5 — Revisión de código automática sobre un PR existente

**Objetivo:** practicar `request_copilot_review` de forma aislada.

1. Crea manualmente una rama `feature/mejora-historial` con un cambio pequeño (por ejemplo, mostrar la fecha completa en el historial de ganadores en vez de solo la hora).
2. Abre un Pull Request hacia `develop`.
3. Pide en el chat: *"Solicita una revisión de Copilot sobre el PR #N"*.
4. Analiza los comentarios generados: ¿detecta problemas de estilo, posibles bugs, o sugerencias de mejora?
5. Aplica al menos una sugerencia y vuelve a solicitar revisión.

---

## Ejercicio 6 — Tarea de mayor alcance (release)

**Objetivo:** simular la preparación de una `release/*` con ayuda del agente.

> Tarea sugerida: *"Prepara la versión 1.1.0: agrega un endpoint de exportación de resultados en JSON, actualiza el README con la nueva funcionalidad y sube el número de versión en package.json"*

**Pasos:**
1. Delega la tarea al agente indicando que el PR debe partir de `develop`.
2. Revisa que el PR incluya cambios de código, documentación y versión.
3. Solicita revisión automática.
4. Una vez aprobado, fusiona a `develop` y luego prepara el merge final a `main` siguiendo Git Flow.

---

## Checklist de aprendizaje

- [ ] Delegué una tarea directamente al agente sin issue previo.
- [ ] Creé un issue y lo asigné al agente.
- [ ] Solicité una revisión automática de código con Copilot.
- [ ] Resolví un bug siguiendo el flujo `bugfix/*`.
- [ ] Simulé la preparación de una `release/*` con ayuda del agente.
- [ ] Comparé los resultados del agente con lo que hubiera hecho manualmente.

## Recursos

- [Documentación: GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent)
- [CONTRIBUTING.md](./CONTRIBUTING.md) — flujo de ramas Git Flow del proyecto
- [README.md](./README.md) — documentación general del proyecto
