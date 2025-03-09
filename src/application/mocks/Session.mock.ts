import { MockBuilder } from "./builder/mockBuilder.mock";
import { ISession } from "../../domain/session/ISession";
import { MockConstants } from "./MockConstants.mock";
import GuidUtil from "../shared/utils/GuidUtil";

export class SessionMock extends MockBuilder<ISession> {
  constructor() {
    super();
    this.reset();
  }

  private initialize(): ISession {
    return {
      sessionId: GuidUtil.getV4WithoutDashes(),
      iat: new Date().getTime(),
    } as ISession;
  }

  reset(): ISession {
    this.mock = this.initialize();

    return this.mock;
  }

  byDefault(): SessionMock {
    this.create({} as ISession)
      .setStrProp("sessionId", GuidUtil.getV4WithoutDashes())
      .setStrProp("iat", new Date().getTime().toString())
      .setStrProp("exp", (new Date().getTime() + 60 * 60 * 1000).toString())
      .setStrProp("email", MockConstants.USER_EMAIL)
      .setBoolProp("emailVerified")
      .setStrProp("name", `${MockConstants.USER_FIRST_NAME} ${MockConstants.USER_LAST_NAME}`)
      .setStrProp("maskedUserUid", MockConstants.USER_MASKED_ID);

    return this;
  }
}
