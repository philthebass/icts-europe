#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
THEME_SLUG=$(basename "$ROOT_DIR")
STYLE_FILE="$ROOT_DIR/style.css"
DIST_DIR="$ROOT_DIR/dist"
REF="${1:-HEAD}"

VERSION=$(sed -n 's/^Version:[[:space:]]*//p' "$STYLE_FILE" | head -n 1)

if [ -z "$VERSION" ]; then
    echo "Could not determine theme version from style.css" >&2
    exit 1
fi

mkdir -p "$DIST_DIR"

ARCHIVE_PATH="$DIST_DIR/${THEME_SLUG}-v${VERSION}.zip"

git -C "$ROOT_DIR" archive \
    --format=zip \
    --worktree-attributes \
    --prefix="${THEME_SLUG}/" \
    -o "$ARCHIVE_PATH" \
    "$REF"

echo "Created $ARCHIVE_PATH from $REF"
