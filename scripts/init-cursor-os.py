from pathlib import Path


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent

    required_dirs = [
        ".cursor/rules",
        "brain",
        "cursor-os",
        "scripts",
    ]

    required_files = [
        "brain/project_context.md",
        "brain/architecture.md",
        "brain/current_state.md",
        "brain/decisions.md",
        "brain/next_steps.md",
        "brain/change_log.md",
        ".cursor/rules/00-repo-brain.mdc",
        ".cursor/rules/01-code-quality.mdc",
        ".cursor/rules/02-debugging.mdc",
        ".cursor/rules/03-planning.mdc",
        "cursor-os/commands.md",
        "cursor-os/skills.md",
        "cursor-os/subagents.md",
        "cursor-os/bootstrap-usage.md",
    ]

    created_dirs = []
    skipped_dirs = []
    created_files = []
    skipped_files = []

    for rel_dir in required_dirs:
        path = repo_root / rel_dir
        if path.exists():
            skipped_dirs.append(rel_dir)
            continue
        path.mkdir(parents=True, exist_ok=True)
        created_dirs.append(rel_dir)

    for rel_file in required_files:
        path = repo_root / rel_file
        if path.exists():
            skipped_files.append(rel_file)
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("", encoding="utf-8")
        created_files.append(rel_file)

    print("Cursor Repo OS bootstrap complete")
    print(f"Directories created: {len(created_dirs)}")
    for item in created_dirs:
        print(f"  + {item}")
    print(f"Directories skipped: {len(skipped_dirs)}")
    for item in skipped_dirs:
        print(f"  = {item}")

    print(f"Files created: {len(created_files)}")
    for item in created_files:
        print(f"  + {item}")
    print(f"Files skipped: {len(skipped_files)}")
    for item in skipped_files:
        print(f"  = {item}")


if __name__ == "__main__":
    main()
