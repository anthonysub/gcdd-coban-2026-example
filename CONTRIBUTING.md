# Guía de contribución (Git Flow)

Este proyecto utiliza el modelo de ramas **Git Flow** para organizar el desarrollo.

## Ramas principales

| Rama | Propósito |
|------|-----------|
| `main` | Código estable, listo para producción. Solo recibe merges desde `release/*` o `hotfix/*`. |
| `develop` | Rama de integración con los últimos cambios desarrollados. Base para nuevas `feature/*`. |

## Ramas de soporte

| Prefijo | Se crea desde | Se fusiona en | Uso |
|---------|----------------|----------------|-----|
| `feature/*` | `develop` | `develop` | Nuevas funcionalidades (ej. `feature/config-avanzada`). |
| `bugfix/*` | `develop` | `develop` | Corrección de errores no urgentes. |
| `release/*` | `develop` | `main` y `develop` | Preparación de una nueva versión (ajustes finales, changelog). |
| `hotfix/*` | `main` | `main` y `develop` | Corrección urgente sobre producción. |

## Flujo típico

```bash
# Nueva funcionalidad
git checkout develop
git pull
git checkout -b feature/nombre-de-la-feature

# ... trabajo y commits ...
git push -u origin feature/nombre-de-la-feature
# Abrir Pull Request hacia develop
```

## Convención de commits

Se utiliza el estándar [Gitemoji](https://gitmoji.dev/) para los mensajes de commit, por ejemplo:

- `✨ Agrega configuración de tema visual a la ruleta`
- `🐛 Corrige cálculo de ángulo del ganador`
- `📝 Actualiza README con instrucciones de instalación`
- `♻️ Refactoriza selección ponderada de participantes`
- `✅ Agrega pruebas para el endpoint de sorteo`

## Pull Requests y revisión con GitHub Copilot

Este repositorio está configurado para trabajar con el **GitHub Copilot coding agent** mediante el servidor MCP de GitHub (`.vscode/mcp.json`):

1. Asigna una tarea/issue al agente de Copilot para que proponga los cambios y abra el Pull Request automáticamente.
2. Solicita una revisión de código automática de Copilot sobre el Pull Request antes de fusionarlo.
3. Una vez aprobado, el PR se fusiona a `develop` (o `main`/`develop` si es un `release/*` o `hotfix/*`).
