# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /usr/node/tsk

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

# Stage 2: Install
FROM node:20-alpine

WORKDIR /usr/node/tsk

COPY --from=build /usr/node/tsk/package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/node/tsk/dist ./dist

EXPOSE 3003

# CMD [ "node", "dist/index" ]
# Observation: remove the previous # char and this line if you aren't working with docker-compose
