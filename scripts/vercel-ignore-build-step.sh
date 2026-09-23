#!/usr/bin/env bash
# Vercel's "Ignored Build Step" (vercel.json's ignoreCommand): skip the build
# for a commit that only touches docs/.github/supabase — see the
# vercel-cost-optimization notes for why this exists at all.
#
# Exit 0 = skip the build. Any other exit code = proceed with the build.
#
# 2026-09-23 incident: Vercel passes the previously-deployed commit's SHA as
# VERCEL_GIT_PREVIOUS_SHA, and diffed it straight against HEAD. On Vercel's
# shallow clone that SHA can be missing from local history entirely — this
# repo had gone many commits without a successful deploy, so the "previous"
# commit on record was ~14 commits behind HEAD, further back than the
# shallow clone's depth reaches. `git diff` against a SHA git doesn't have
# fails with "fatal: bad object <sha>", which happens to be a non-zero exit
# so Vercel still built (fail-open) — nothing broke that run, but every
# deploy from then on would unconditionally build, including doc-only ones,
# silently defeating the whole point of this script.
#
# Fix: verify the commit is actually reachable before diffing against it; if
# it isn't, fetch more history first. Only fall back to "just build" once a
# fetch has genuinely failed to make it reachable.
set -euo pipefail

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$PREV" ]; then
  # No previous deployment on record (first deploy, or Vercel didn't supply
  # one) — the original command's own fallback, same intent preserved.
  PREV="$(git rev-parse HEAD^ 2>/dev/null || true)"
fi
if [ -z "$PREV" ]; then
  echo "vercel-ignore-build-step: no previous commit to compare against — building."
  exit 1
fi

if ! git cat-file -e "$PREV" 2>/dev/null; then
  echo "vercel-ignore-build-step: $PREV not in the shallow clone — fetching more history."
  git fetch --quiet --unshallow origin 2>/dev/null \
    || git fetch --quiet --depth=1000 origin 2>/dev/null \
    || true
fi

if ! git cat-file -e "$PREV" 2>/dev/null; then
  echo "vercel-ignore-build-step: $PREV still unreachable after fetching — building."
  exit 1
fi

git diff --quiet "$PREV" HEAD -- . ':(exclude)*.md' ':(exclude)docs' ':(exclude).github' ':(exclude)supabase'
