#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
    echo "Usage: sh scripts/release-theme.sh <version> <release-date> [git-ref]" >&2
    exit 1
fi

VERSION="$1"
RELEASE_DATE="$2"
REF="${3:-HEAD}"

php "$ROOT_DIR/scripts/prepare-release.php" "$VERSION" "$RELEASE_DATE"

echo "Release files updated. Fill in CHANGELOG.md, then commit your changes."
echo "When ready, build the deployable zip with:"
echo "  sh scripts/build-theme-package.sh $REF"
