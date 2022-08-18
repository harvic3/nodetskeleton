import applicationStatus from "../../../application/shared/status/applicationStatus";
import appMessages, { localKeys } from "../../../application/shared/locals/messages";
import tsKernel, { IServiceContainer } from "dic-tsk";

tsKernel.init({
  internalErrorCode: applicationStatus.INTERNAL_ERROR,
  classNameBase: "",
  interfaceBaseName: "",
  appMessages,
  appErrorMessageKey: localKeys.DEPENDENCY_NOT_FOUNT,
  applicationStatus,
  applicationStatusCodeKey: "INTERNAL_ERROR",
});

export { IServiceContainer };
export default tsKernel;
