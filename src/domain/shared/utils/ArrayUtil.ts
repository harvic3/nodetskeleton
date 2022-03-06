export default class ArrayUtil {
  static first<T>(list: T[]): T | null {
    if (!list?.length) {
      return null;
    }
    return list[0];
  }

  static last<T>(list: T[]): T | null {
    if (!list?.length) {
      return null;
    }
    const lastPosition = list.length - 1;
    return list[lastPosition];
  }

  static getIndex<T>(list: T[], position: number): T | null {
    if (!list?.length) {
      return null;
    }
    return list[position];
  }

  static allOrDefault<T>(list: T[]): T[] {
    if (!list?.length) {
      return [];
    }
    return list;
  }
}
