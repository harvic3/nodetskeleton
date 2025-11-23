export interface IWorkerResult<O> {
  error?: { 
    message: string;
    statusCode: string | number;
  };
  data?: O;
}
