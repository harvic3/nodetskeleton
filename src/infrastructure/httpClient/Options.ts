import { RequestInit } from "node-fetch";

export class Options implements RequestInit {
  timeout: number;

  setTimeOut(timeout: number): void {
    this.timeout = timeout;
  }
}
