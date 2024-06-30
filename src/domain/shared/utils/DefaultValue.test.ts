import { DefaultValue } from "./DefaultValue";
import { StringUtil } from "./StringUtil";

// Mocks

// Builders

// Constants

describe("when use DefaultValue", () => {
  it("tests String Value", async () => {
    // Arrange
    const value = "value";
    const secondValue = "valueSecond";
    const spaceValue = " ";

    // Act

    // Assert
    expect(DefaultValue.evaluateAndGet(StringUtil.EMPTY, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(null, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(undefined, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(spaceValue, value)).toBe(spaceValue);

    expect(DefaultValue.evaluateAndGet(value, StringUtil.EMPTY)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, secondValue)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, secondValue)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, spaceValue)).toBe(value);

    expect(DefaultValue.evaluateAndGet(value, secondValue)).toBe(value);
    expect(DefaultValue.evaluateAndGet(secondValue, value)).toBe(secondValue);
  });

  it("tests Number Value", async () => {
    // Arrange
    const value = 123;
    const secondValue = 456;
    const valueZero = 0;

    // Act

    // Assert
    expect(DefaultValue.evaluateAndGet(value, secondValue)).toBe(value);
    expect(DefaultValue.evaluateAndGet(secondValue, value)).toBe(secondValue);
    expect(DefaultValue.evaluateAndGet(valueZero, value)).toBe(valueZero);
    expect(DefaultValue.evaluateAndGet(Number.NaN, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(undefined, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(null, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, Number.NaN)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, secondValue)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, secondValue)).toBe(value);
  });

  it("tests Boolean Value", async () => {
    // Arrange
    const valueTrue = true;
    const valueFalse = false;

    // Act

    // Assert
    expect(DefaultValue.evaluateAndGet(valueTrue, valueFalse)).toBe(valueTrue);
    expect(DefaultValue.evaluateAndGet(valueFalse, valueTrue)).toBe(valueFalse);
  });
});
