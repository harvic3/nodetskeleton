import config from "../config/index";

const defaultLanguage = "en";

class Resource {
  private language = defaultLanguage;
  private locals = config.locals.langs;
  keys = config.locals.keys;
  Init(language: string): void {
    this.language = language != null ? language : defaultLanguage;
  }
  Get(resourceName: string): string {
    if (this.locals[this.language]) {
      return this.locals[this.language][resourceName];
    }
    return this.locals[defaultLanguage][resourceName];
  }
}

const instance = new Resource();

export default instance;
