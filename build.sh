#!/usr/bin/env bash

echo $BASH_VERSION

export NEXT_TELEMETRY_DISABLED=1
export NEXT_PUBLIC_OPENMEV_URI=https://api.sushirelay.com/v1

printf -v beg '%(%s)T\n'
sleep 1

echo "Building..."
yarn install --pure-lockfile

npx next telemetry disable

NODE_ENV=production npx next build


S_HASH=$(node -e 'process.stdout.write("sha256-");process.stdin.pipe(crypto.createHash("sha256").setEncoding("base64")).pipe(process.stdout)' < yarn.lock) 
echo "${S_HASH}" >> public/.well-known/SRI_HASH
git show -s --format=%ct HEAD > public/.well-known/commit-ts.txt

printf 'https://app.sushi.com/%s\n' */* | sort > INDEX

sleep 1

printf -v now '%(%s)T\n'
echo beg=$beg now=$now elapsed=$((now - beg))


exit 0
