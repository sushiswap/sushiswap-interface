#!/usr/bin/env bash
BUILD_HASH_VERSION=$(git rev-parse --short HEAD 2>/dev/null || find ./* -type f -name '*.go' -print0 | sort -z | xargs -0 sha1sum | sha1sum | sed -r 's/[^\da-f]+//g')
echo "$BUILD_HASH_VERSION"
