FROM node:20-alpine

WORKDIR /usr/node/tsk-gateway

COPY package*.json ./

RUN npm i

ADD ./ /usr/node/tsk-gateway

RUN npm run build

EXPOSE 8080

# CMD [ "node", "dist/index" ]
