#!/usr/bin/env bash
# Commit the given paths (if they changed) and push to main, retrying when another data job pushed first.
# Each data job writes its own files, so a rebase never conflicts.
set -euo pipefail
msg="$1"; shift
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -- "$@"
if git diff --cached --quiet; then echo "No changes"; exit 0; fi
git commit -q -m "$msg"
for i in 1 2 3 4 5 6; do
  if git push -q origin HEAD:main; then echo "Pushed"; exit 0; fi
  sleep $((i * 4))
  git pull -q --rebase origin main
done
echo "Push failed after retries"; exit 1
