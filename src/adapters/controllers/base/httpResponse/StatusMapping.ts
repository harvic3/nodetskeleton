import applicationStatus from "../../../../application/shared/status/applicationStatus";
import { HttpStatusEnum } from "./HttpStatusEnum";

const statusMapping: Record<string, number> & { default: number } = {
  default: HttpStatusEnum.CONTINUE,
};

/* 
  You don't need to add mapping for all applicationStatus, 
  because if you use the produce property when you are setting the routes in the controller, 
  it does the mapping for you according to the applicationStatus and HttpStatus that you will set.
  Here only map the applicationStatus that you will not use the produce property.
*/
statusMapping[applicationStatus.SUCCESS] = HttpStatusEnum.SUCCESS;
statusMapping[applicationStatus.CREATED] = HttpStatusEnum.CREATED;
statusMapping[applicationStatus.NOT_CONTENT] = HttpStatusEnum.NOT_CONTENT;
statusMapping[applicationStatus.INVALID_INPUT] = HttpStatusEnum.BAD_REQUEST;
statusMapping[applicationStatus.UNAUTHORIZED] = HttpStatusEnum.UNAUTHORIZED;
statusMapping[applicationStatus.NOT_FOUND] = HttpStatusEnum.NOT_FOUND;
statusMapping[applicationStatus.INTERNAL_ERROR] = HttpStatusEnum.INTERNAL_SERVER_ERROR;
statusMapping[applicationStatus.NOT_IMPLEMENTED] = HttpStatusEnum.NOT_IMPLEMENTED;
statusMapping[applicationStatus.WORKER_ERROR] = HttpStatusEnum.INTERNAL_SERVER_ERROR;

export default statusMapping;
