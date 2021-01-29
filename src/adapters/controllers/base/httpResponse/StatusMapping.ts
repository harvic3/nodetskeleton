import * as applicationStatus from "../../../../application/shared/status/applicationStatusCodes.json";
import * as httpStatus from "./httpStatusCodes.json";

const statusMapping: { [key: string]: number } = {};

statusMapping[applicationStatus.SUCCESS] = httpStatus.SUCCESS;
statusMapping[applicationStatus.CREATED] = httpStatus.CREATED;
statusMapping[applicationStatus.NOT_CONTENT] = httpStatus.NOT_CONTENT;
statusMapping[applicationStatus.BAD_REQUEST] = httpStatus.BAD_REQUEST;
statusMapping[applicationStatus.NOT_FOUND] = httpStatus.NOT_FOUND;
statusMapping[applicationStatus.INTERNAL_SERVER_ERROR] = httpStatus.INTERNAL_SERVER_ERROR;

export default statusMapping;
