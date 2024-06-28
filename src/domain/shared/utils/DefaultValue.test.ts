import { DefaultValue } from "./DefaultValue";
import { StringUtil } from "./StringUtil";

// Mocks

// Builders

// Constants

describe("Tests DefaultValue", () => {
  it("tests String Value", async () => {
    // Arrange
    const value = "value";
    const valueSecond = "valueSecond";
    const valueSpace = " ";

    // Act

    // Assert
    expect(DefaultValue.evaluateAndGet(StringUtil.EMPTY, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(null, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(undefined, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(valueSpace, value)).toBe(valueSpace);

    expect(DefaultValue.evaluateAndGet(value, StringUtil.EMPTY)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, null)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, undefined)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, valueSpace)).toBe(value);

    expect(DefaultValue.evaluateAndGet(value, valueSecond)).toBe(value);
    expect(DefaultValue.evaluateAndGet(valueSecond, value)).toBe(valueSecond);
  });

  it("tests Number Value", async () => {
    // Arrange
    const value = 123;
    const valueSecond = 456;
    const valueZero = 0;

    // Act

    // Assert
    expect(DefaultValue.evaluateAndGet(value, valueSecond)).toBe(value);
    expect(DefaultValue.evaluateAndGet(valueSecond, value)).toBe(valueSecond);
    expect(DefaultValue.evaluateAndGet(valueZero, value)).toBe(valueZero);
    expect(DefaultValue.evaluateAndGet(Number.NaN, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(undefined, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(null, value)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, Number.NaN)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, undefined)).toBe(value);
    expect(DefaultValue.evaluateAndGet(value, null)).toBe(value);
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
