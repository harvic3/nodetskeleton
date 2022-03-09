import * as gateway from "fast-gateway";
import "dotenv/config";

type Service = { name: string; entryPath: string; dockerHost: string; port: number };

const withDockerHost = process.env.WITH_DOCKER_HOST
  ? process.env.WITH_DOCKER_HOST === "true"
  : false;

const GATEWAY_PORT = Number(process.env.PORT || 8080);
const LOCAL_HOST = "http://localhost";
const DOCKER_HOST = "http://host.docker.internal";
const API_PREFIX = "/api";

const services: Service[] = [
  {
    name: "Security service",
    entryPath: `/security${API_PREFIX}`,
    dockerHost: "host.docker.internal",
    port: 3003,
  },
  {
    name: "Users service",
    entryPath: `/management${API_PREFIX}`,
    dockerHost: "host.docker.internal",
    port: 3004,
  },
];

const server = gateway({
  routes: services.map((service: Service) => {
    const target = withDockerHost
      ? `${DOCKER_HOST}:${service.port}`
      : `${LOCAL_HOST}:${service.port}`;
    console.log(
      `Router ${LOCAL_HOST}:${GATEWAY_PORT}${service.entryPath} to ${target}${API_PREFIX}`,
    );
    return {
      prefix: service.entryPath,
      prefixRewrite: API_PREFIX,
      target,
    };
  }),
});

server
  .start(GATEWAY_PORT)
  .then(() => {
    console.log(`Api gateway running on http://localhost:${GATEWAY_PORT}`);
  })
  .catch((err) => {
    console.error("Gateway Error:", err);
  });
