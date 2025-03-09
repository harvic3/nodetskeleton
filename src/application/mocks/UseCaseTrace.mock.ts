import { DefaultValue } from "../../domain/shared/utils/DefaultValue";
import GuidUtil from "../../application/shared/utils/GuidUtil";
import { UseCaseTrace } from "../shared/log/UseCaseTrace";
import { MockBuilder } from "./builder/mockBuilder.mock";
import { ISession } from "../../domain/session/ISession";
import { MockConstants } from "./MockConstants.mock";

export class UseCaseTraceMock extends MockBuilder<UseCaseTrace> {
  constructor() {
    super();
    this.reset();
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
    this.mock = this.initialize();

    return this.mock;
  }

  byDefault(
    session: ISession,
    transactionId = GuidUtil.getV4(),
    context: string = MockConstants.SOME_CONTEXT,
  ): UseCaseTraceMock {
    this.create(this.initialize(session, transactionId))
      .setProp("session", session)
      .setProp("transactionId", transactionId)
      .setProp("origin", MockConstants.ORIGIN)
      .setProp("startDate", new Date().toISOString())
      .setProp("metadata", {})
      .setProp("context", context);

    return this;
  }

  withClient(
    value = { ip: MockConstants.CLIENT_IP, agent: MockConstants.WEB_AGENT },
  ): UseCaseTraceMock {
    this.setProp("client", value);

    return this;
  }
}
