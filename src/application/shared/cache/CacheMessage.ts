export class CacheMessage<T> {
  constructor(public readonly key: string, public data: T) {}

  toJSON(): string | null {
    if (!this.data) return null;

    return JSON.stringify(this.data);
  }

  static fromJSON<T>(json: string): CacheMessage<T> | null {
    if (!json) return null;

    return JSON.parse(json) as CacheMessage<T>;
  }
}
