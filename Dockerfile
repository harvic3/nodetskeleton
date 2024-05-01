FROM node:20-slim

WORKDIR /usr/node/tsk

COPY package*.json ./

RUN npm ci

ADD . /usr/node/tsk

RUN npm run build

EXPOSE 3003/tcp

# CMD [ "node", "dist/index" ]
# Observation: remove # and this line if you dont work with docker-compose
