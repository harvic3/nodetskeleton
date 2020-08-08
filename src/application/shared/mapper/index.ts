import { IMap } from "./IMap";

class Mapper implements IMap {
  MapObject<S, D>(source: S, destination: D): D {
    if (!source) {
      return destination;
    }
    const keys: string[] = Object.keys(destination);
    keys.forEach((key) => {
      if (typeof destination[key] === "boolean") {
        destination[key] = source[key];
      } else {
        destination[key] = source[key] || null;
      }
    });
    return destination;
  }
  MapArray<S, D>(source: S[], activator: () => D): D[] {
    const destination: D[] = [];
    if (source?.length === 0) {
      return destination;
    }
    source.forEach((sElement) => {
      const dElement: D = activator();
      destination.push(this.MapObject<S, D>(sElement, dElement));
    });
    return destination;
  }
  Activator<D>(type: new () => D): D {
    return new type();
  }
}

const mapper = new Mapper();

export default mapper;
