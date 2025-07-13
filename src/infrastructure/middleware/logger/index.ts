import { NextFunction, Request, Response } from "../../app/core/Modules";
import { Middleware } from "../types";

class LoggerMiddleware {
  handle: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = new Date().getTime();
    const path = req.path || req.url;

    res.on("finish", () => {
      const duration = new Date().getTime() - startTime;
      console.log(`[${req.method}]: ${path} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });

    return next();
  };
}

export default new LoggerMiddleware();
