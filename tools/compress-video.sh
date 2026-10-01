#!/usr/bin/env bash
# ==============================================================================
# KailVarn Video Compression Utility
# Compresses interior walkthrough videos for fast web playback.
# - High-efficiency H.264 video with near-lossless CRF (24)
# - Faststart (+faststart) moov atom for immediate progressive streaming
# - YUV420P color space for universal browser/mobile support (iOS, Android, Chrome, Safari)
# - Audio: AAC 128k stereo or muted
# ==============================================================================

set -euo pipefail

if ! command -v ffmpeg &> /dev/null; then
  echo "Error: ffmpeg is not installed or not in PATH."
  echo "Install with: brew install ffmpeg"
  exit 1
fi

if [ "$#" -lt 1 ]; then
  echo "Usage: ./tools/compress-video.sh <input_file> [output_file]"
  echo "Example: ./tools/compress-video.sh raw-walkthrough.mov public/videos/living-room.mp4"
  exit 1
fi

INPUT="$1"
if [ ! -f "$INPUT" ]; then
  echo "Error: Input file '$INPUT' does not exist."
  exit 1
fi

OUTPUT="${2:-${INPUT%.*}-compressed.mp4}"
OUT_DIR="$(dirname "$OUTPUT")"
mkdir -p "$OUT_DIR"

echo "Compressing video: $INPUT -> $OUTPUT"
ORIG_SIZE=$(stat -f%z "$INPUT" 2>/dev/null || stat -c%s "$INPUT" 2>/dev/null || echo "0")

ffmpeg -y -i "$INPUT" \
  -c:v libx264 \
  -preset slow \
  -crf 24 \
  -profile:v high \
  -level 4.2 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac -b:a 128k -ar 44100 -ac 2 \
  "$OUTPUT"

NEW_SIZE=$(stat -f%z "$OUTPUT" 2>/dev/null || stat -c%s "$OUTPUT" 2>/dev/null || echo "0")

if [ "$ORIG_SIZE" -gt 0 ] && [ "$NEW_SIZE" -gt 0 ]; then
  DIFF=$((ORIG_SIZE - NEW_SIZE))
  PCT=$((DIFF * 100 / ORIG_SIZE))
  ORIG_MB=$(awk "BEGIN {printf \"%.2f\", $ORIG_SIZE/1048576}")
  NEW_MB=$(awk "BEGIN {printf \"%.2f\", $NEW_SIZE/1048576}")
  echo "Compression complete!"
  echo "Original: ${ORIG_MB} MB -> Compressed: ${NEW_MB} MB (${PCT}% reduction)"
else
  echo "Compression complete -> $OUTPUT"
fi
