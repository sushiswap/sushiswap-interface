#!/bin/bash
set -eo pipefail

npx next build

echo "Configuring RPC Connections"
DEFAULT_RPC_URI='https://api.sushirelay.com/v1'

if [[ -n "${OPENMEV_RPC_URI}" ]]; then
    echo "Replacing default RPC URI value with '${OPENMEV_RPC_URI}' ..."
    find .next/static/chunks .next/server/chunks -type f -exec sed -i -e "s|${DEFAULT_RPC_URI}|${OPENMEV_RPC_URI}|g" {} \;
fi

echo "Executing NextJS server..."
yarn start
