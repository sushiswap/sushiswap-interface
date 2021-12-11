# syntax=docker/dockerfile:1

FROM node:14.17-alpine 
 
RUN apk update
RUN apk add --no-cache \
      xvfb \
      xvfb-run \
      git \  
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    TEST_BASE_URL=http://127.0.0.1:3000 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./
 
CMD ["xvfb-run", "-a", "npm", "run", "e2e"]


 