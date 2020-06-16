import { ExampleService } from "../src/services/example.service";
import * as HttpError from "http-errors";

const exampleService = new ExampleService;

describe("when sum two numbers", () => {
  it("should show error if some number is null", () => {
    expect(() => exampleService.sumTwoNumbers(7, null))
    .toThrowError(HttpError(404, "Any number can be null"));
  });
  it("should sum two not null numbers", () => {
    expect(exampleService.sumTwoNumbers(7, 5)).toBe(12);
  });
});

describe("when sum array numbers", () => {
  
  it("should sum if they area all numbers", async () => {
    expect(await exampleService.sumArrayNumbers([0,1,1,2,3,5])).toBe(12);
  });
});
