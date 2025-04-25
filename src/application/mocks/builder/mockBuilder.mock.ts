import { NumberUtil } from "../../../domain/shared/utils/NumberUtil";
import { StringUtil } from "../../../domain/shared/utils/StringUtil";

export class MockBuilder<T extends object | ObjectConstructor> {
  mock: T;

  constructor(mock = {} as T) {
    this.mock = mock;
  }

  build(): T {
    return this.mock;
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

  getDefined(): T {
    if (this.mock?.constructor) {
      return new (this.mock.constructor as ObjectConstructor)() as T;
    } else {
      return {} as T;
    }
  }

  create(value: T): MockBuilder<T> {
    this.mock = value;

    return this;
  }

  setProp<K extends keyof T>(propName: K, value: T[K]): MockBuilder<T> {
    Reflect.set(this.mock, propName, value);

    return this;
  }

  setNumProp<K extends keyof T>(propName: K, value?: number): MockBuilder<T> {
    if (typeof value === "undefined") value = NumberUtil.getRandom({ min: 1, max: 99999 });
    Reflect.set(this.mock, propName, value);

    return this;
  }

  setStrProp<K extends keyof T>(propName: K, value?: string): MockBuilder<T> {
    if (typeof value === "undefined") value = StringUtil.getRandomString({ min: 3, max: 10 });
    Reflect.set(this.mock, propName, value);

    return this;
  }

  deleteProp<K extends keyof T>(propName: K): MockBuilder<T> {
    Reflect.deleteProperty(this.mock, propName);

    return this;
  }
}
