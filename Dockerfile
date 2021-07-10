FROM node:16

WORKDIR /sushiswap

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

ARG MANIFOLD_FINANCE_RPC_URI='https://api.staging.sushirelay.com/v1'
ENV NEXT_PUBLIC_MANIFOLD_FINANCE_URI=${MANIFOLD_FINANCE_RPC_URI}

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
