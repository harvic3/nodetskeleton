export default class ArraUtils {
  static first<T>(list: T[]): T {
    if (!list?.length) {
      return null;
    }
    return list[0];
  }
}
