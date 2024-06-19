import { describe, expect, it } from "@jest/globals";

import { Gender } from "./genre/Gender.enum";
import { User } from "./User";

describe("Domain User - describe", () => {
  it("must instantiate a User and validate that the data is the same as informed and valid", () => {
    const uid = "uid";
    const maskedUid = "maskedUid";
    const firstName = "joao";
    const lastName = "silva";
    const email = "a@a.com";
    const gender: Gender = Gender.MALE;
    const verified = true;
    const createdAt = "createdAt";
    const user = new User({
      uid,
      maskedUid,
      firstName,
      lastName,
      email,
      gender,
      verified,
      createdAt,
    });

    expect(user.uid).toEqual(uid);
    expect(user.maskedUid).toEqual(maskedUid);
    expect(user.firstName).toEqual(firstName);
    expect(user.lastName).toEqual(lastName);
    expect(user.email?.value).toEqual(email);
    expect(user.email?.isValid()).toBeTruthy();
    expect(user.gender).toEqual(gender);
    expect(user.verified).toEqual(verified);
    expect(user.createdAt).toEqual(createdAt);
  });

  it("must instantiate an invalid User and test the integrity of the object", () => {
    const user = new User({} as any);

    expect(user.uid).toBeUndefined();
    expect(user.maskedUid).toBeUndefined();
    expect(user.firstName).toBeUndefined();
    expect(user.lastName).toBeUndefined();
    expect(user.email?.value).toBeUndefined();
    expect(user.email?.isValid()).toBeFalsy();
    expect(user.gender).toBeUndefined();
    expect(user.verified).toBeUndefined();
    expect(user.createdAt).toBeUndefined();
  });
});
