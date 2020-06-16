// // For KoaJs
// import { Context } from "../config/";
// import * as moment from "moment";
// import { ExampleService } from "../services/example.service";

// const exampleService = new ExampleService();

// export const pong = (context: Context) => {
//   context.body = `pong at ${moment.now()}`;
// }

// export const hello = (context: Context) => {
//   context.body = `hello ${context.query.name}`;
// }

// export const echo = (context: Context) => {
//   const body = context.request.body;
//   body.date = moment.now();
//   context.body = body;
// }

// export const sumTwoNumbers = (context: Context) => {
//   const body = context.request.body;
//   context.body = exampleService.sumTwoNumbers(body.numberA, body.numberB);
// }

// export const sumArrayNumbers = async (context: Context) => {
//   const body = context.request.body;
//   context.body = await exampleService.sumArrayNumbers(body.numbers);
// }



// For ExpressJs
import { Request, Response } from "../config/";
import * as moment from "moment";
import { ExampleService } from "../services/example.service";

const exampleService = new ExampleService();

export const pong = (req: Request, res: Response) => {
  res.send(`pong at ${moment.now()}`);
}

export const hello = (req: Request, res: Response) => {
  res.send(`hello ${req.query.name}`);
}

export const echo = (req: Request, res: Response) => {
  const body = req.body;
  body.date = moment.now();
  res.json(body);
}

export const sumTwoNumbers = (req: Request, res: Response) => {
  const body = req.body;
  res.json(exampleService.sumTwoNumbers(body.numberA, body.numberB));
}

export const sumArrayNumbers = async (req: Request, res: Response) => {
  const body = req.body;
  res.json(await exampleService.sumArrayNumbers(body.numbers));
}