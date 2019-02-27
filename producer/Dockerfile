FROM node:10-alpine

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base 

RUN npm install -g nodemon

RUN mkdir -p /home/node/app/producer/node_modules && chown -R node:node /home/node/app 

WORKDIR /home/node/app/producer

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "nodemon", "index.js" ]