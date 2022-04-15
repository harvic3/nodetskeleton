export interface IMockBuilder<T> {
  reset(): T;
  build(): T;
}
