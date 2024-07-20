FROM node:20-slim

WORKDIR /usr/node/tsk

COPY package*.json ./

ADD . /usr/node/tsk

RUN npm ci

RUN npm run build

EXPOSE 3003/tcp

# CMD [ "node", "dist/index" ]
# Observation: remove the previous # char and this line if you aren't working with docker-compose
