import { ApplicationStatus } from "../../../../application/shared/status/applicationStatus";
import { HttpStatusEnum } from "./HttpStatusEnum";

const statusMapping: Record<string, number> & { DEFAULT: number } = {
  DEFAULT: HttpStatusEnum.CONTINUE,
};

/* 
  You don't need to add mapping for all applicationStatus, 
  because if you use the produce property when you are setting the routes in the controller, 
  it does the mapping for you according to the ApplicationStatus and HttpStatus that you will set.
  Here only map the applicationStatus that you will not use the produce property.
*/
statusMapping[ApplicationStatus.SUCCESS] = HttpStatusEnum.SUCCESS;
statusMapping[ApplicationStatus.CREATED] = HttpStatusEnum.CREATED;
statusMapping[ApplicationStatus.NOT_CONTENT] = HttpStatusEnum.NOT_CONTENT;
statusMapping[ApplicationStatus.INVALID_INPUT] = HttpStatusEnum.BAD_REQUEST;
statusMapping[ApplicationStatus.UNAUTHORIZED] = HttpStatusEnum.UNAUTHORIZED;
statusMapping[ApplicationStatus.NOT_FOUND] = HttpStatusEnum.NOT_FOUND;
statusMapping[ApplicationStatus.INTERNAL_ERROR] = HttpStatusEnum.INTERNAL_SERVER_ERROR;
statusMapping[ApplicationStatus.NOT_IMPLEMENTED] = HttpStatusEnum.NOT_IMPLEMENTED;
statusMapping[ApplicationStatus.WORKER_ERROR] = HttpStatusEnum.INTERNAL_SERVER_ERROR;

export default statusMapping;
