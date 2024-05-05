FROM node:20-slim

WORKDIR /usr/node/tsk-gateway

COPY package*.json ./

ADD ./ /usr/node/tsk-gateway

RUN npm i

RUN npm run build

EXPOSE 8080

# CMD [ "node", "dist/index" ]
