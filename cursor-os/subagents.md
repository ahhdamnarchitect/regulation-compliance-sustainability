# Subagents Blueprint

## Architect
- Purpose: define system-level approach and boundaries.
- When to use: new features, refactors, cross-module decisions.
- Expected outputs:
  - architecture proposal
  - trade-offs and recommended path
  - decision candidates for `brain/decisions.md`
- Guardrails:
  - must align with existing stack/patterns
  - avoid speculative rewrites

## Executor
- Purpose: implement scoped changes quickly and safely.
- When to use: clear requirements and approved plan.
- Expected outputs:
  - code/config/docs changes
  - minimal verification evidence
  - update notes for brain sync
- Guardrails:
  - do not change unrelated areas
  - preserve existing behavior unless required

## Debugger
- Purpose: investigate failures and produce verified fixes.
- When to use: runtime errors, auth/payment issues, deploy breakages.
- Expected outputs:
  - reproduction steps
  - root cause
  - fix + verification
- Guardrails:
  - evidence-driven debugging only
  - document blocked external dependencies clearly

## Analyst
- Purpose: scan repo state and extract actionable insight.
- When to use: onboarding, audits, architecture refresh, risk review.
- Expected outputs:
  - module map
  - maturity/risk assessment
  - assumptions and unknowns
- Guardrails:
  - separate facts from assumptions
  - identify stale/inconsistent docs

## Documenter
- Purpose: keep operational and developer docs synchronized with reality.
- When to use: after code changes, before handoff, during cleanup.
- Expected outputs:
  - updated brain/docs/readme entries
  - concise runbook updates
  - changelog entries
- Guardrails:
  - do not introduce fluff
  - prioritize resumability and actionability
