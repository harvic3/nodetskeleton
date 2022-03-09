import { Nulldifined } from "../Nulldifined";

export default class ArrayUtil {
  static NOT_FOUND_INDEX = -1;
  static FIRST_ELEMENT_INDEX = 0;

  static first<T>(list: T[]): T | null {
    if (!list?.length) {
      return null;
    }
    return list[ArrayUtil.FIRST_ELEMENT_INDEX];
  }

  static last<T>(list: T[]): T | null {
    if (!list?.length) {
      return null;
    }
    const lastIndex = list.length - 1;
    return list[lastIndex];
  }

  static getIndex<T>(list: T[], position: number): T | null {
    if (!list?.length) {
      return null;
    }
    return list[position];
  }

  static allOrDefault<T>(list: T[] | Nulldifined): T[] {
    if (!list?.length) {
      return [];
    }
    return list;
  }

  static any(list: any[] | Nulldifined): boolean {
    return !!list?.length;
  }
}
