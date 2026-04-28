#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT="$DIR/og-image.svg"
OUTPUT="$DIR/og-image.png"

if command -v google-chrome &>/dev/null; then
  google-chrome --headless --disable-gpu \
    --screenshot="$OUTPUT" \
    --window-size=1200,630 \
    "file://$INPUT"
  echo "Generated via Chrome: $OUTPUT"

elif command -v chromium-browser &>/dev/null; then
  chromium-browser --headless --disable-gpu \
    --screenshot="$OUTPUT" \
    --window-size=1200,630 \
    "file://$INPUT"
  echo "Generated via Chromium: $OUTPUT"

elif command -v inkscape &>/dev/null; then
  inkscape "$INPUT" \
    --export-filename="$OUTPUT" \
    --export-width=1200 \
    --export-height=630
  echo "Generated via Inkscape: $OUTPUT"

elif command -v rsvg-convert &>/dev/null; then
  rsvg-convert -w 1200 -h 630 "$INPUT" -o "$OUTPUT"
  echo "Generated via rsvg-convert: $OUTPUT"

else
  echo "No suitable tool found. Install one of:"
  echo "  - Google Chrome / Chromium"
  echo "  - Inkscape"
  echo "  - librsvg (rsvg-convert)"
  exit 1
fi
