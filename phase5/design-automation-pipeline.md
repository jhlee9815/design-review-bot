# UNO HOME Design Automation Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gated Figma-to-development pipeline where designer changes are detected, reflected in code, verified, reviewed by the designer, and promoted to dev only after approval.

**Architecture:** The pipeline is intentionally gate-based. Figma snapshots and diffs produce structured change records, classified changes decide whether code can be updated automatically, verification creates evidence, and dev promotion is blocked until designer approval is recorded.

**Tech Stack:** Figma REST API or Figma MCP, React, TypeScript, Tailwind CSS v4, Playwright, shell scripts, macOS launchd.

---

## Figma Source

The pipeline reads the UNO HOME Figma file configured for this project.

| Item | Value |
|---|---|
| Figma file key | `SXPVingkmqkrcLzcXYFsZd` |
| Config file | `config/figma.yaml` |

## Pipeline Contract

| Stage | Input | Output | Stop Condition |
|---|---|---|---|
| `preflight` | `config/figma.yaml` | config and file access result | Missing config, inaccessible file |
| `snapshot` | Figma file data | `.automation/snapshots/{timestamp}.json` | Figma read failure |
| `diff` | approved baseline + latest snapshot | `.automation/diffs/{timestamp}.json` | No baseline/snapshot pair, malformed snapshot |
| `classify` | diff JSON, mapping config | change classes with automation eligibility | Unmapped node marked as code-impacting |
| `apply-to-code` | eligible changes | source file edits and apply report | Unknown or unsafe change class |
| `verify` | changed code | build, lint, screenshot, visual diff report | Build/lint failure or visual diff above threshold |
| `designer-review` | verification report | approval record | Designer rejects or requests edits |
| `promote-to-dev` | approved change set | dev branch/environment update | Missing approval record |

## Change Classes

| Class | Examples | Automation Level |
|---|---|---|
| `token` | color, spacing, radius, shadow, typography value changes | Auto-apply |
| `text` | labels, titles, helper text, notification copy | Auto-apply when node is mapped |
| `component-props` | button variant, input state, badge type, nav active state | Auto-apply when mapping defines prop path |
| `asset` | image, SVG, icon asset replacement | Auto-apply only when asset target is mapped |
| `layout` | frame gap, padding, alignment, fixed dimensions | Partial auto-apply; verify visually |
| `structure` | new section, removed component, reordered hierarchy | Generate report; manual review before apply |
| `unknown` | unmapped node, unsupported Figma property, ambiguous target | Report only |

## Required Files

| File | Responsibility |
|---|---|
| `config/figma.yaml` | Figma file key, file URL, stage list |
| `config/figma-mapping.yaml` | Figma logical targets mapped to code files and automation policy |
| `docs/design-automation-pipeline.md` | This pipeline contract |
| `.automation/snapshots/` | Historical Figma snapshots |
| `.automation/diffs/` | Structured diffs between approved baseline and latest snapshot |
| `.automation/reports/` | Verification and designer-review reports |
| `scripts/pipeline/preflight.ts` | Validate config and Figma file access |
| `scripts/pipeline/snapshot.ts` | Save the current Figma state |
| `scripts/pipeline/diff.ts` | Compare snapshots |
| `scripts/pipeline/classify.ts` | Convert raw diff into change classes |
| `scripts/pipeline/apply.ts` | Apply eligible changes to source code |
| `scripts/pipeline/verify.ts` | Run build, lint, screenshots, and visual checks |
| `scripts/pipeline/promote-dev.ts` | Promote an approved change set to dev |
| `scripts/pipeline/run.sh` | Execute the gated pipeline in order |

## Path Resolution

`config/figma-mapping.yaml` resolves all relative paths from the directory containing that config file. Because the mapping file lives at `uno-home/config/figma-mapping.yaml`, paths use this pattern:

| Target | Example |
|---|---|
| Root-level design token file | `../../tokens.json` |
| App source file | `../src/components/Button.tsx` |
| Generated CSS token output | `../src/index.css` |

This keeps the configuration portable across machines as long as the repository folder structure is preserved.

## Gate Rules

1. `preflight` is mandatory for every run.
2. No code edit may run when a change is classified as `unknown`.
3. `structure` changes require a human implementation plan before code edits.
4. `npm run build` and `npm run lint` must pass before designer review.
5. Designer review must produce an approval record before `promote-to-dev`.
6. Dev promotion must include the report path and the verified change set id.

## Initial Mapping Policy

The first implementation should support these automation levels:

| Target Type | Initial Policy |
|---|---|
| Tokens | Full auto-apply from token JSON to CSS |
| Atomic components | Auto-apply token and prop-level changes only |
| Composite components | Auto-apply mapped text and prop-level changes only |
| Screens | Report layout and structure changes first; apply after review |

## Step 1 Deliverables

- [x] Create `docs/design-automation-pipeline.md`
- [x] Create `config/figma-mapping.yaml`
- [x] Update root `plan.md` so Phase 5 matches the gated designer-review workflow
- [ ] Fill actual Figma node ids after the connector can access the project Figma file
