// // For KoaJs
// import * as Server from "koa";
// import * as Router from "koa-router";
// import * as BodyParser from "koa-bodyparser";
// export { Context } from "koa";

// export default {
//   Server,
//   Router,
//   BodyParser,
// }



// For ExpressJs
import * as Server from "express";
import * as BodyParser from "body-parser";
export { Request, Response, NextFunction } from "express";

export default {
  Server,
  Router: Server.Router,
  BodyParser,
}

