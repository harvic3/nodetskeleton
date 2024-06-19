import { describe, expect, it } from "@jest/globals";

import { PasswordBuilder } from "./PasswordBuilder";

import { StringUtil } from "../shared/utils/StringUtil";

describe("Domain PasswordBuilder - describe", () => {
  it("must instantiate an invalid PasswordBuilder", () => {
    const email = "";
    const passwordBase64 = StringUtil.EMPTY;

    const passwordBuilder = new PasswordBuilder(email, passwordBase64);

    expect(passwordBuilder.value).toEqual(`${email}-${passwordBase64}`);
    expect(passwordBuilder.passwordBase64).toEqual(passwordBase64);
    expect(passwordBuilder.isValid()).toBeFalsy();
  });
});
