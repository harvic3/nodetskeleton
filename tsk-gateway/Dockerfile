FROM node:16-slim

WORKDIR /usr/node/gateway

COPY package*.json ./

RUN npm i

ADD ./ /usr/node/gateway

RUN npm run build

EXPOSE 8080

# CMD [ "node", "dist/index" ]
