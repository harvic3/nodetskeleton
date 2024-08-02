import { ApplicationStatus } from "../../../application/shared/status/applicationStatus";
import appMessages from "../../../application/shared/locals/messages";
import tsKernel, { IServiceContainer } from "dic-tsk";

tsKernel.init({
  internalErrorCode: ApplicationStatus.INTERNAL_ERROR,
  appMessages,
  appErrorMessageKey: appMessages.keys.DEPENDENCY_NOT_FOUND,
  applicationStatus: ApplicationStatus,
  applicationStatusCodeKey: ApplicationStatus.INTERNAL_ERROR,
});

export { IServiceContainer };
export default tsKernel;
