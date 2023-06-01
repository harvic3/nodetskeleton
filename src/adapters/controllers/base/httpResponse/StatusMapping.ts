import applicationStatus from "../../../../application/shared/status/applicationStatus";
import httpStatus from "./httpStatus";

const statusMapping: Record<string, number> & { default: number } = {
  default: httpStatus.VARIANT_ALSO_NEGOTIATES,
};

statusMapping[applicationStatus.SUCCESS] = httpStatus.SUCCESS;
statusMapping[applicationStatus.CREATED] = httpStatus.CREATED;
statusMapping[applicationStatus.NOT_CONTENT] = httpStatus.NOT_CONTENT;
statusMapping[applicationStatus.INVALID_INPUT] = httpStatus.BAD_REQUEST;
statusMapping[applicationStatus.UNAUTHORIZED] = httpStatus.UNAUTHORIZED;
statusMapping[applicationStatus.NOT_FOUND] = httpStatus.NOT_FOUND;
statusMapping[applicationStatus.INTERNAL_ERROR] = httpStatus.INTERNAL_SERVER_ERROR;
statusMapping[applicationStatus.NOT_IMPLEMENTED] = httpStatus.NOT_IMPLEMENTED;
statusMapping[applicationStatus.WORKER_ERROR] = httpStatus.INTERNAL_SERVER_ERROR;

export default statusMapping;
