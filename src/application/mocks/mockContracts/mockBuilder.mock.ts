import { NumberUtil } from "../../../domain/shared/utils/NumberUtil";
import { StringUtil } from "../../../domain/shared/utils/StringUtil";

export class MockBuilder<T extends object> {
  mock: T;

  constructor(mock = {} as T) {
    this.mock = mock;
  }

  build(): T {
    return { ...this.mock };
  }

  reset(): T {
    this.mock = {} as T;

    return this.mock;
  }

  getNull(): T {
    return null as any;
  }

  getUndefined(): T {
    return undefined as any;
  }

  /**
   * Create a new instance of a T Class
   * @param activator is a Class type with a constructor
   * @returns MockBuilder<T>
   */
  static activator<T>(type: new () => T): T {
    return new type();
  }

  makeClass(activator: () => T): MockBuilder<T> {
    this.mock = activator();

    return this;
  }

  /**
   * Create a defined T JSON Type
   * @returns MockBuilder<T>
   */
  makeType(): MockBuilder<T> {
    this.mock = {} as T;

    return this;
  }

  setProperty<K extends keyof T>(property: K, value: T[K]): MockBuilder<T> {
    Reflect.set(this.mock, property, value);

    return this;
  }

  setNumProp<K extends keyof T>(property: K, value?: number): MockBuilder<T> {
    if (typeof value === "undefined") NumberUtil.getRandom({ min: 0, max: 1000 });
    Reflect.set(this.mock, property, value);

    return this;
  }

  setStringProp<K extends keyof T>(property: K, value?: string): MockBuilder<T> {
    if (typeof value === "undefined") StringUtil.getRandomString({ min: 3, max: 100 });
    Reflect.set(this.mock, property, value);

    return this;
  }

  setBoolProp<K extends keyof T>(property: K, value: boolean): MockBuilder<T> {
    Reflect.set(this.mock, property, value);

    return this;
  }
}
