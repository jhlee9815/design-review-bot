# Phase 5-8 — launchd Scheduler

## Status

Implemented locally for macOS `launchd`.

## Files

| File | Purpose |
|---|---|
| `config/com.uno-home.figma-pipeline.plist` | Source plist template |
| `~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist` | Installed launchd agent |
| `.automation/logs/scheduler-stdout.log` | Scheduler stdout |
| `.automation/logs/scheduler-stderr.log` | Scheduler stderr |

## Schedule

Runs every day at 21:00 local time.

## Register

```bash
cp config/com.uno-home.figma-pipeline.plist ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
launchctl bootstrap "gui/$UID" ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
launchctl list | grep uno-home
```

If the agent is already registered, unload it first:

```bash
launchctl bootout "gui/$UID" ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
```

## Manual Test Run

```bash
launchctl kickstart -k "gui/$UID/com.uno-home.figma-pipeline"
```

Then inspect:

```bash
tail -n 80 .automation/logs/scheduler-stdout.log
tail -n 80 .automation/logs/scheduler-stderr.log
```

## Unregister

```bash
launchctl bootout "gui/$UID" ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
rm ~/Library/LaunchAgents/com.uno-home.figma-pipeline.plist
```

## Notes

- `FIGMA_TOKEN` is loaded by `tsx --env-file=.env` inside `scripts/pipeline/run.sh`.
- The plist PATH includes `/usr/local/bin`, where this machine resolves `node`, `npm`, and `npx`.
- `scripts/pipeline/run.sh` uses `set -e`; the scheduler stops at the first failed stage and writes output to scheduler logs.
