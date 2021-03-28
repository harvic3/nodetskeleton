export default class ArrayUtils {
  static first<T>(list: T[]): T {
    if (!list?.length) {
      return null;
    }
    return list[0];
  }

  static last<T>(list: T[]): T {
    if (!list?.length) {
      return null;
    }
    const lastPosition = list.length - 1;
    return list[lastPosition];
  }
}
