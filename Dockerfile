FROM node:14.8.0-stretch

WORKDIR /usr/node/app

COPY package*.json ./

RUN npm ci

ADD . /usr/node/app

RUN npm run build

EXPOSE 3040/tcp

# CMD [ "node", "dist/index" ]
# Observation: remove # and this line if you dont work with docker-compose
