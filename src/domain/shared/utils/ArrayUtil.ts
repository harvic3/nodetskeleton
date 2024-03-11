import { Nulldefined } from "../types/Nulldefined.type";

export default class ArrayUtil {
  static readonly NOT_FOUND_INDEX = -1;
  static readonly FIRST_INDEX = 0;
  static readonly INDEX_ONE = 1;

  static first<T>(list: T[]): T | null {
    if (!list?.length) {
      return null;
    }
    return list[ArrayUtil.FIRST_INDEX];
  }

  static last<T>(list: T[]): T | null {
    if (!list?.length) {
      return null;
    }
    const lastIndex = list.length - 1;
    return list[lastIndex];
  }

  static getWithIndex<T>(list: T[], index: number): T | null {
    if (!list?.length) {
      return null;
    }
    return list[index];
  }

  static allOrDefault<T>(list: T[] | Nulldefined): T[] {
    if (!list?.length) {
      return [];
    }
    return list;
  }

  static any(list: any[] | Nulldefined): boolean {
    return !!list?.length;
  }

  static fromObject<T>(object: any): T[] {
    return Object.keys(object).map((key) => object[key]);
  }
}
