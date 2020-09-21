// For KoaJs
// import * as Server from "koa";
// import * as Router from "koa-router";
// import * as BodyParser from "koa-bodyparser";
// import * as cors from "@koa/cors";

// export { Context, Next } from "koa";
// export { Server, Router, BodyParser, cors };

// For ExpressJs
import * as Server from "express";
import * as BodyParser from "body-parser";

const Router = Server.Router;

export { Request, Response, NextFunction, Application, Router as RouterType } from "express";
export { Server, Router, BodyParser };
