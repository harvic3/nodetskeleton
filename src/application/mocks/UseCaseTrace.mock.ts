import { DefaultValue } from "../../domain/shared/utils/DefaultValue";
import GuidUtil from "../../application/shared/utils/GuidUtil";
import { IMockBuilder } from "./mockContracts/IMockBuilder";
import { UseCaseTrace } from "../shared/log/UseCaseTrace";
import { ISession } from "../../domain/session/ISession";
import { MockConstants } from "./MockConstants";

export class UseCaseTraceMock implements IMockBuilder<UseCaseTrace> {
  #audit: UseCaseTrace;

  constructor() {
    this.#audit = this.initialize(undefined);
  }

  private initialize(session?: ISession, transactionId?: string): UseCaseTrace {
    const audit = new UseCaseTrace(
      DefaultValue.evaluateAndGet(session, {} as ISession),
      new Date(),
      MockConstants.ORIGIN,
      DefaultValue.evaluateAndGet(transactionId, GuidUtil.getV4()),
    );
    audit.setRequest({ params: undefined, query: undefined, body: undefined });

    return audit;
  }

  reset(): UseCaseTrace {
    this.#audit = this.initialize(undefined);

    return this.#audit;
  }

  build(): UseCaseTrace {
    return this.#audit;
  }

  withSession(session: ISession): UseCaseTraceMock {
    this.#audit = this.initialize(session);

    return this;
  }

  withClient(
    value = { ip: MockConstants.CLIENT_IP, agent: MockConstants.WEB_AGENT },
  ): UseCaseTraceMock {
    this.#audit.setClient(value);

    return this;
  }

  byDefault(session: ISession, transactionId = GuidUtil.getV4()): UseCaseTraceMock {
    this.#audit = this.initialize(session, transactionId);
    this.withClient();

    return this;
  }
}
