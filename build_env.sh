#!/bin/bash
export CI=''
export NODE_ENV='production'
export NEXT_PUBLIC_GOOGLE_ANALYTICS='UA-194716744-3'
yarn install
npx next build

echo "Configuring RPC Connections"
DEFAULT_RPC_URI='https://api.sushirelay.com/v1'

if [[ -n "${MANIFOLD_FINANCE_RPC_URI}" ]]; then
    echo "Replacing default RPC URI value with '${MANIFOLD_FINANCE_RPC_URI}' ..."
    find .next/static/chunks .next/server/chunks -type f -exec sed -i -e "s|${DEFAULT_RPC_URI}|${MANIFOLD_FINANCE_RPC_URI}|g" {} \;
fi

echo "Executing NextJS server..."
yarn start
