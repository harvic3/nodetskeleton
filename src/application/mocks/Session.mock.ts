import { IMockBuilder } from "./mockContracts/IMockBuilder";
import { ISession } from "../../domain/session/ISession";
import { MockConstants } from "./MockConstants";
import GuidUtil from "../shared/utils/GuidUtil";

export class SessionMock implements IMockBuilder<ISession> {
  #session: ISession;

  constructor() {
    this.#session = this.initialize();
  }

  private initialize(): ISession {
    return {
      sessionId: GuidUtil.getV4WithoutDashes(),
      iat: new Date().getTime(),
    } as ISession;
  }

  reset(): ISession {
    this.#session = this.initialize();

    return this.#session;
  }

  build(): ISession {
    return this.#session;
  }

  withMaskedUid(value = MockConstants.USER_ID): SessionMock {
    this.#session.maskedUserUid = value;

    return this;
  }

  withEmail(value = MockConstants.USER_EMAIL): SessionMock {
    this.#session.email = value;

    return this;
  }

  withEmailVerified(value = true): SessionMock {
    this.#session.emailVerified = value;

    return this;
  }

  withName(
    value = `${MockConstants.USER_FIRST_NAME} ${MockConstants.USER_LAST_NAME}`,
  ): SessionMock {
    this.#session.name = value;

    return this;
  }

  withExpiration(value = new Date().getTime() + 60 * 60 * 1000): SessionMock {
    this.#session.exp = value;

    return this;
  }

  byDefault(): SessionMock {
    this.withMaskedUid().withEmail().withEmailVerified().withName().withExpiration();

    return this;
  }
}
