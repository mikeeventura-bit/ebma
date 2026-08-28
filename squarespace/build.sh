#!/usr/bin/env bash
# Assembles squarespace/custom-css.css from the shared design system.
#
# The prototype and the live Squarespace site share three CSS files verbatim.
# Editing those files and re-running this script is what stops the two from
# drifting apart. Never hand-edit custom-css.css — your changes will be lost.
#
#   usage:  ./squarespace/build.sh
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=squarespace/custom-css.css
SRC=prototype/assets/css

{
  cat <<'HEADER'
/* ==========================================================================
   EBMA — SQUARESPACE CUSTOM CSS
   --------------------------------------------------------------------------
   GENERATED FILE — DO NOT EDIT BY HAND.
   Built by squarespace/build.sh from:
       prototype/assets/css/tokens.css
       prototype/assets/css/components.css
       prototype/assets/css/sections.css
       squarespace/_squarespace-layer.css
   Edit those, then re-run ./squarespace/build.sh

   WHERE THIS GOES
   Squarespace admin -> Design -> Custom CSS -> paste the whole file -> Save.
   Requires a Business plan or higher.

   NOT INCLUDED, deliberately: prototype-only.css. That file holds the reset,
   navigation and footer chrome that Squarespace supplies natively. Pasting it
   would fight the platform.
   ========================================================================== */

HEADER
  for f in tokens components sections; do
    printf '\n/* ===== %s.css ===== */\n' "$f"
    cat "$SRC/$f.css"
  done
  printf '\n\n'
  cat squarespace/_squarespace-layer.css
} > "$OUT"

echo "Built $OUT ($(wc -l < "$OUT") lines, $(wc -c < "$OUT") bytes)"

# Squarespace's Custom CSS panel has a practical size ceiling; warn early.
BYTES=$(wc -c < "$OUT")
if [ "$BYTES" -gt 400000 ]; then
  echo "WARNING: $BYTES bytes may exceed the Custom CSS panel limit." >&2
fi
