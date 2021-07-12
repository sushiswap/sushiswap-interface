FROM node:16 as builder

WORKDIR /build

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./

ARG MANIFOLD_FINANCE_RPC_URI='https://api.staging.sushirelay.com/v1'
ENV NEXT_PUBLIC_MANIFOLD_FINANCE_URI=${MANIFOLD_FINANCE_RPC_URI}

RUN yarn build

FROM node:16-alpine

RUN apk add --no-cache tini

WORKDIR /sushiswap-interface

COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/.next ./.next
COPY --from=builder /build/public ./public

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["yarn", "start"]
