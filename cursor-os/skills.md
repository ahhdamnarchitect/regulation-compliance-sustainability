# Skills Blueprint

## `brain_update`
- Purpose: keep memory files accurate after every meaningful change.
- When to use: end of each task, before handoff, before session end.
- Expected outputs:
  - updated `current_state.md`
  - appended `change_log.md`
  - refreshed `next_steps.md`
  - optional `decisions.md` update
- Guardrails:
  - never erase history from change log
  - mark uncertainty as `Unknown`/`Assumption`/`TODO`

## `repo_analyze`
- Purpose: map architecture, dependencies, entry points, and maturity.
- When to use: session start, major refactor, onboarding, drift checks.
- Expected outputs:
  - refreshed `project_context.md`
  - refreshed `architecture.md`
  - explicit gaps and assumptions list
- Guardrails:
  - cite evidence from actual files
  - avoid generic template language

## `debug_mode`
- Purpose: isolate and resolve bugs systematically.
- When to use: errors, regressions, failing builds, broken integrations.
- Expected outputs:
  - reproducible issue statement
  - root-cause hypothesis + fix
  - verification notes
- Guardrails:
  - evidence before fixes
  - one root cause at a time

## `plan_mode`
- Purpose: design execution for non-trivial tasks.
- When to use: multi-file work, architectural decisions, uncertain scope.
- Expected outputs:
  - scoped plan
  - risk/dependency list
  - validation checklist
- Guardrails:
  - avoid over-planning simple tasks
  - keep plan actionable and time-bounded

## `ship_mode`
- Purpose: complete work with clean handoff and resumability.
- When to use: task completion, release prep, context handover.
- Expected outputs:
  - what changed
  - validation status
  - remaining risks/open questions
  - brain fully synchronized
- Guardrails:
  - no “done” claim without checks
  - no missing resume state
