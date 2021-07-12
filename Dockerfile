FROM node:16

WORKDIR /sushiswap-interface

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./

ARG MANIFOLD_FINANCE_RPC_URI='https://api.staging.sushirelay.com/v1'
ENV NEXT_PUBLIC_MANIFOLD_FINANCE_URI=${MANIFOLD_FINANCE_RPC_URI}

RUN yarn build

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /bin/tini
RUN chmod +x /bin/tini

EXPOSE 3000

ENTRYPOINT ["/bin/tini", "--"]
CMD ["yarn", "start"]
