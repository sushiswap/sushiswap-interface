#!/usr/bin/env bash

# Use this script to only deploy production builds
# https://vercel.com/docs/platform/projects#ignored-build-step
# https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel#with-a-script

# runs with Makefile to generate hash on CI
# shellcheck disable=SC2034
SCRIPT_COMMIT_SHA="${LOAD_SCRIPT_COMMIT_SHA}"
# LOAD_SCRIPT_COMMIT_SHA='$(shell git rev-parse HEAD)' envsubst '$(addprefix $$,$(ENVSUBST_VARS))' < $< > $@

echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "production" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  yarn install --frozen-lockfile
  yarn run postinstall
  npx next build
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 1;
fi

echo "ERROR: Command not found"
exit 127