---
schema_version: 1
open_count: 3
waived_count: 0
fixed_count: 0
total_count: 3
last_updated: 2026-09-19T02:39:43.306Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 1 | todo | public/favicon.svg |  | Favicon y favicon.ico son los del scaffold de Astro; reemplazar por el isotipo de Loops Growth (Fase 2 o 3) | open |  | 2026-09-19T01:37:20.064Z |  |
| 2 | 1 | stub | src/styles/tokens.css |  | Tokens form-min-h-sm y form-min-h-lg (1100px y 900px) provisionales; el Plan 04 (FORM-04) los reemplaza por los medidos | open |  | 2026-09-19T02:18:02.400Z |  |
| 3 | 01 | deviation | tests/e2e/a11y-base.spec.ts |  | Plan 03 Task 2: el contorno de foco del interior del iframe de ClickUp no se puede medir desde la pagina (Chromium no marca :focus ni :focus-visible en el IFRAME al entrar con Tab); el caso (c) excluye el IFRAME y el contorno interior es de ClickUp (EXCEPTIONS.md Fase 3) | open |  | 2026-09-19T02:39:43.306Z |  |

````json
[
  {
    "id": 1,
    "kind": "todo",
    "phase": "1",
    "file": "public/favicon.svg",
    "line": null,
    "description": "Favicon y favicon.ico son los del scaffold de Astro; reemplazar por el isotipo de Loops Growth (Fase 2 o 3)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-19T01:37:20.064Z",
    "resolved_at": null
  },
  {
    "id": 2,
    "kind": "stub",
    "phase": "1",
    "file": "src/styles/tokens.css",
    "line": null,
    "description": "Tokens form-min-h-sm y form-min-h-lg (1100px y 900px) provisionales; el Plan 04 (FORM-04) los reemplaza por los medidos",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-19T02:18:02.400Z",
    "resolved_at": null
  },
  {
    "id": 3,
    "kind": "deviation",
    "phase": "01",
    "file": "tests/e2e/a11y-base.spec.ts",
    "line": null,
    "description": "Plan 03 Task 2: el contorno de foco del interior del iframe de ClickUp no se puede medir desde la pagina (Chromium no marca :focus ni :focus-visible en el IFRAME al entrar con Tab); el caso (c) excluye el IFRAME y el contorno interior es de ClickUp (EXCEPTIONS.md Fase 3)",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-09-19T02:39:43.306Z",
    "resolved_at": null
  }
]
````
