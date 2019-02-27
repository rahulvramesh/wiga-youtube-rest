FROM node:10-alpine

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
    ffmpeg \
    apache2

RUN npm install -g nodemon

RUN mkdir -p /home/node/app/consumer/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app/consumer

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD [ "nodemon", "index.js" ]