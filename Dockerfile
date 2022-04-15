FROM node:16-slim

WORKDIR /usr/node/app

COPY package*.json ./

RUN npm ci

ADD . /usr/node/app

RUN npm run build

EXPOSE 3003/tcp

# CMD [ "node", "dist/index" ]
# Observation: remove # and this line if you dont work with docker-compose
