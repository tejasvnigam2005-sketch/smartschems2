#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# install-hooks.sh — Installs git hooks for the SmartSchemes repo.
# Run once after cloning:  bash scripts/install-hooks.sh
# ──────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "❌  Not inside a git repository."
  exit 1
}

HOOK_DIR="$REPO_ROOT/.git/hooks"
HOOK_SRC="$REPO_ROOT/scripts/pre-commit"
HOOK_DST="$HOOK_DIR/pre-commit"

if [ ! -f "$HOOK_SRC" ]; then
  echo "❌  scripts/pre-commit not found. Make sure it exists."
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DST"
chmod +x "$HOOK_DST"

echo "✅  pre-commit hook installed at $HOOK_DST"
echo "    It will scan staged files for secrets before every commit."
