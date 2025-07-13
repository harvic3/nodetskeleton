export class AsyncUtil {
  static async waitFor(timeInMilliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeInMilliseconds);
    });
  }
}
