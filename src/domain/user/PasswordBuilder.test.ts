import { PasswordBuilder } from "./PasswordBuilder";
import { StringUtil } from "../shared/utils/StringUtil";

describe("Domain PasswordBuilder - describe", () => {
  it("must instantiate an invalid PasswordBuilder", () => {
    // Arrange
    const email = StringUtil.EMPTY;
    const passwordBase64 = StringUtil.EMPTY;

    // Act
    const passwordBuilder = new PasswordBuilder(email, passwordBase64);

    // Assert
    expect(passwordBuilder.value).toEqual(`${email}-${passwordBase64}`);
    expect(passwordBuilder.passwordBase64).toEqual(passwordBase64);
    expect(passwordBuilder.isValid()).toBeFalsy();
  });
});
