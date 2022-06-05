export class CacheMessage {
  static toJSON<T>(data: T): string {
    return JSON.stringify(data);
  }

  static fromJSON<T>(json: string): T | null {
    if (!json) return null;

    return JSON.parse(json) as T;
  }
}
