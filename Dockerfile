FROM node:16

WORKDIR /sushiswap-interface

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . ./

RUN yarn build

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /bin/tini
RUN chmod +x /bin/tini

RUN chmod +x ./entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=45s --start-period=60s CMD node healthcheck.js

ENTRYPOINT ["/bin/tini", "--"]
CMD ["/sushiswap-interface/entrypoint.sh"]
