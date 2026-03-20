# Bootstrap Usage

## Script
`scripts/init-cursor-os.py`

## What It Does
- Creates required folders for Repo OS.
- Creates missing brain/rules/cursor-os files.
- Skips files that already exist (no overwrite).
- Prints a created vs skipped summary.

## Run
From repo root:

```bash
python scripts/init-cursor-os.py
```

## Notes
- Safe to run repeatedly.
- If files already exist, script preserves them.
