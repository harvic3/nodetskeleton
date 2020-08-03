export interface IMap {
  MapObject<S, D>(source: S, destination: D): D;
  MapArray<S, D>(source: S[], activator: () => D): D[];
  Activator<D>(type: new () => D): D;
}
