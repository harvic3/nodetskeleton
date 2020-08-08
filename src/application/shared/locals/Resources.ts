export class Resources {
  private defaultLanguage: string;
  private language: string;
  private locals: { [key: string]: { [key: string]: string } };
  private localKeys: { [key: string]: string };
  constructor(
    defaultLanguage: string,
    locals: { [key: string]: { [key: string]: string } },
    localKeys: { [key: string]: string },
  ) {
    this.defaultLanguage = defaultLanguage;
    this.localKeys = localKeys;
    this.locals = locals;
    if (!this.locals[defaultLanguage]) {
      throw new Error("Default language not found in local resources.");
    }
    const keysToCheck = Object.keys(this.localKeys);
    const langToCheck = Object.keys(locals);
    const notFindedResources: string[] = [];
    keysToCheck.forEach((key) => {
      langToCheck.forEach((lang) => {
        if (!this.locals[lang][key]) {
          notFindedResources.push(`${lang}: ${key}`);
        }
      });
    });
    if (notFindedResources.length > 0) {
      throw new Error(
        `The messages for ${notFindedResources.join(", ")} was not found in local resources.`,
      );
    }
  }
  Init(language: string): void {
    if (!this.locals[language]) {
      console.log(`Accept-Language "${language}" not found in local resources.`);
      return;
    }
    this.language = language;
  }
  Get(resourceName: string): string {
    if (this.locals[this.language] && this.locals[this.language][resourceName]) {
      return this.locals[this.language][resourceName];
    }
    if (this.locals[this.defaultLanguage] && this.locals[this.defaultLanguage][resourceName]) {
      return this.locals[this.defaultLanguage][resourceName];
    }
    throw new Error(`Resource ${resourceName} not found in any local resource.`);
  }
  GetWithParams(resourceName: string, params: { [key: string]: string }): string {
    let resource: string;
    if (this.locals[this.language] && this.locals[this.language][resourceName]) {
      resource = this.locals[this.language][resourceName];
    } else if (
      this.locals[this.defaultLanguage] &&
      this.locals[this.defaultLanguage][resourceName]
    ) {
      resource = this.locals[this.defaultLanguage][resourceName];
    }
    if (!resource) {
      throw new Error(`Resource ${resourceName} not found in any local resource.`);
    }
    const keys = Object.keys(params);
    keys.forEach((key) => {
      const pattern = `({{)${key}(}})`;
      const regex = RegExp(pattern);
      if (regex.test(resource)) {
        while (regex.test(resource)) {
          resource = resource.replace(`{{${key}}}`, params[key]);
        }
      }
    });
    return resource;
  }
}
