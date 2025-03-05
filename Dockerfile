# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /usr/node/tsk

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

# Stage 2: Install
FROM node:22-alpine

WORKDIR /usr/node/tsk

COPY --from=build /usr/node/tsk/package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/node/tsk/dist ./dist

EXPOSE 3003

CMD [ "node", "dist/index" ]
