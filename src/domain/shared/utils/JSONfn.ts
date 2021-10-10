export class JSONfn {
  static stringify(obj: any): string {
    return JSON.stringify(obj, (key: string, value: unknown) => {
      return typeof value === "function" ? value.toString() : value;
    });
  }

  static parse(str: string): any {
    return JSON.parse(str, (key: string, value: unknown) => {
      if (typeof value === "string" && value.startsWith("function")) {
        const body = value.substring(value.indexOf("{") + 1, value.lastIndexOf("}"));
        const args = value.substring(value.indexOf("(") + 1, value.indexOf(")")).split(",");
        return new Function(...args, body);
      }
      return value;
    });
  }
}
