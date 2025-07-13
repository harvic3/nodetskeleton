import { BaseHttpClient, BodyType, ReqArgs } from "../../adapters/shared/httpClient/BaseHttpClient";
import { HttpStatusEnum } from "../../adapters/controllers/base/httpResponse/HttpStatusEnum";
import { SerializationTypeEnum } from "../../adapters/shared/httpClient/SerializationType";
import { HttpMethodEnum } from "../../adapters/controllers/base/context/HttpMethod.enum";
import { Headers, HttpResponseType } from "../../adapters/shared/httpClient/ITResponse";
import { ApplicationError } from "../../application/shared/errors/ApplicationError";
import { ObjectPropertyUtil } from "../../domain/shared/utils/ObjectPropertyUtil";
import { HttpHeaderEnum } from "../../adapters/controllers/base/Base.controller";
import { DefaultValue } from "../../domain/shared/utils/DefaultValue";
import { AsyncUtil } from "../../application/shared/utils/AsyncUtil";
import { BooleanUtil } from "../../domain/shared/utils/BooleanUtil";
import appMessages from "../../application/shared/locals/messages";
import ArrayUtil from "../../domain/shared/utils/ArrayUtil";
import { Busboy } from "@fastify/busboy";
import { TResponse } from "./TResponse";
import { Readable } from "node:stream";

export type RetrySetup = {
  retries: number;
  incrementalDelayInMs: number;
  retryWhenStatusIs: number[];
  doNotRetryWhenStatusIs: number[];
};

export class HttpClient extends BaseHttpClient {
  readonly #SERIALIZED = true;

  private buildRequest(
    url: string,
    method: string,
    body?: BodyType,
    headers?: Headers,
    options: RequestInit = {},
  ): Request {
    const origin = { method, body, headers };

    ObjectPropertyUtil.assign(origin, options, "method");
    ObjectPropertyUtil.assign(origin, options, "body");
    ObjectPropertyUtil.assign(origin, options, "headers");

    return new Request(url, options);
  }

  private async processClientErrorResponse<ErrType>(
    response: Response,
  ): Promise<[ErrType | string, boolean]> {
    let result = null;
    try {
      result = await response.text();
      return [JSON.parse(result), this.#SERIALIZED];
    } catch (error) {
      return [error as ErrType | string, !this.#SERIALIZED];
    }
  }

  private processErrorResponse<ResType, ErrType>(
    errorResponse: [string | ErrType, boolean],
    result: TResponse<ResType, ErrType>,
    response: Response,
  ): void {
    if (BooleanUtil.areEqual(errorResponse[ArrayUtil.INDEX_ONE], this.#SERIALIZED)) {
      result.setErrorMessage(
        DefaultValue.evaluateAndGet(
          response?.statusText,
          appMessages.get(appMessages.keys.UNKNOWN_RESPONSE_STATUS),
        ),
      );
      result.setErrorResponse(errorResponse[ArrayUtil.FIRST_INDEX] as ErrType);
    } else {
      result.setErrorMessage(response.statusText);
      result.setErrorResponse(errorResponse[ArrayUtil.FIRST_INDEX] as ErrType);
    }
  }

  private formData<T>(response: Response): Promise<HttpResponseType<T>> {
    return new Promise((resolve, reject) => {
      const contentType = response.headers.get("content-type");
      if (!contentType) {
        return reject(new Error("Missing Content-Type header in response for formData parsing."));
      }

      if (!contentType.includes("multipart/form-data")) {
        return reject(new Error(`Invalid content-type for form-data: ${contentType}`));
      }

      const busboy = new Busboy({
        headers: { [HttpHeaderEnum.CONTENT_TYPE]: contentType },
        limits: {
          fieldSize: 10 * 1024 * 1024, // 10MB by each field
          fields: 1000, // maximum 1000 fields
          files: 100, // maximum 100 files
          fileSize: 100 * 1024 * 1024, // 100MB by each file
          parts: 1100, // total parts (fields + files)
        },
        preservePath: true, // Preserve file paths (fix for paths with /)
        defCharset: "utf8", // Default charset
      });

      if (!response.body) {
        return resolve({} as T);
      }

      const result: Record<string, any> = {};
      let activeFiles = 0;
      let isFinished = false;

      const cleanup = (timeoutId: NodeJS.Timeout) => {
        clearTimeout(timeoutId);
        if (!isFinished) {
          busboy.destroy();
        }
      };

      const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
      const timeoutMs = Math.min(Math.max(contentLength / 1000, 10000), 120000); // Between 10s and 2min

      const formattingTimeout = setTimeout(() => {
        reject(new Error(`FormData parsing timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      busboy.on("field", (name, value, truncated, valueTruncated) => {
        // Check if the data was truncated
        if (truncated || valueTruncated) {
          cleanup(formattingTimeout);
          return reject(new Error(`Field '${name}' exceeded size limits`));
        }

        if (Object.hasOwn(result, name)) {
          if (!Array.isArray(result[name])) {
            result[name] = [result[name]];
          }
          result[name].push(value);
        } else {
          result[name] = value;
        }
      });

      busboy.on("file", (name, file, filename, encoding, mimeType) => {
        activeFiles++;
        const chunks: Buffer[] = [];
        let fileSize = 0;
        let hasError = false;

        file.on("data", (chunk: Buffer) => {
          if (!hasError) {
            fileSize += chunk.length;
            chunks.push(chunk);
          }
        });

        file.on("end", () => {
          if (hasError) return;

          activeFiles--;

          try {
            const buffer = Buffer.concat(chunks);
            const blob = new Blob([buffer], { type: mimeType });

            // Create a File object compatible with the web standard
            const fileObject = Object.assign(blob, {
              name: filename || "unnamed",
              size: fileSize,
              type: mimeType,
              lastModified: Date.now(),
              encoding,
            });

            if (Object.hasOwn(result, name)) {
              if (!Array.isArray(result[name])) {
                result[name] = [result[name]];
              }
              result[name].push(fileObject);
            } else {
              result[name] = fileObject;
            }

            // If there are no more active files and busboy has finished, resolve
            if (activeFiles === 0 && isFinished) {
              cleanup(formattingTimeout);
              resolve(result as T);
            }
          } catch (error) {
            hasError = true;
            cleanup(formattingTimeout);
            reject(new Error(`File object creation error: ${(error as Error).message}`));
          }
        });

        file.on("error", (error) => {
          hasError = true;
          activeFiles--;
          cleanup(formattingTimeout);
          reject(new Error(`File processing error: ${error.message}`));
        });

        file.on("limit", () => {
          hasError = true;
          activeFiles--;
          cleanup(formattingTimeout);
          reject(new Error(`File '${filename}' exceeded size limit`));
        });
      });

      busboy.on("finish", () => {
        isFinished = true;
        // Only resolve if there are no active files
        if (activeFiles === 0) {
          cleanup(formattingTimeout);
          resolve(result as T);
        }
      });

      busboy.on("error", (error) => {
        cleanup(formattingTimeout);
        reject(new Error(`Busboy error: ${(error as Error).message}`));
      });

      busboy.on("partsLimit", () => {
        cleanup(formattingTimeout);
        reject(new Error("Too many parts in multipart data"));
      });

      busboy.on("filesLimit", () => {
        cleanup(formattingTimeout);
        reject(new Error("Too many files in multipart data"));
      });

      busboy.on("fieldsLimit", () => {
        cleanup(formattingTimeout);
        reject(new Error("Too many fields in multipart data"));
      });

      try {
        // Use pipeline for better error handling and backpressure
        const readable = Readable.fromWeb(response.body);
        readable.pipe(busboy);

        // Handle stream errors
        readable.on("error", (error) => {
          cleanup(formattingTimeout);
          reject(new Error(`Stream error: ${error.message}`));
        });
      } catch (error) {
        cleanup(formattingTimeout);
        reject(new Error(`Failed to process form data stream: ${(error as Error).message}`));
      }
    });
  }

  private async processResponseData<ResType>(
    response: Response,
    serializationMethod: SerializationTypeEnum,
  ): Promise<HttpResponseType<ResType>> {
    try {
      switch (serializationMethod) {
        case SerializationTypeEnum.ARRAY_BUFFER:
          return await response.arrayBuffer();
        case SerializationTypeEnum.TEXT:
          return await response.text();
        case SerializationTypeEnum.BLOB:
          return await response.blob();
        case SerializationTypeEnum.FORM_DATA:
          return this.formData<ResType>(response);
        default:
          return (await response.json()) as ResType;
      }
    } catch (error) {
      throw new ApplicationError(
        HttpClient.name,
        appMessages.get(appMessages.keys.PROCESSING_DATA_CLIENT_ERROR),
        HttpStatusEnum.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async send<ResType, ErrType>(
    url: string,
    reqArgs: ReqArgs = {
      method: HttpMethodEnum.GET,
      body: undefined,
      headers: undefined,
      options: undefined,
      serializationMethod: SerializationTypeEnum.JSON,
    },
  ): Promise<TResponse<ResType, ErrType>> {
    const request = this.buildRequest(
      url,
      reqArgs?.method,
      reqArgs.body,
      reqArgs.headers,
      reqArgs.options,
    );
    const result = new TResponse<ResType, ErrType>();
    try {
      const response = await fetch(request);
      if (response.ok) {
        const data = await this.processResponseData<ResType>(response, reqArgs.serializationMethod);
        result.setResponse(data);
      } else {
        const errorResponse = await this.processClientErrorResponse<ErrType>(response);
        this.processErrorResponse<ResType, ErrType>(errorResponse, result, response);
      }
      result.setStatusCode(response.status);
    } catch (error) {
      result.setErrorMessage((error as Error).message);
      result.setStatusCode(HttpStatusEnum.INTERNAL_SERVER_ERROR);
      result.setError(error as Error);
    }

    return result;
  }

  async sendWithRetry<ResType, ErrType>(
    url: string,
    retryOpts: RetrySetup,
    reqArgs: ReqArgs = {
      method: HttpMethodEnum.GET,
      serializationMethod: SerializationTypeEnum.JSON,
      body: undefined,
      headers: undefined,
      options: undefined,
      timeout: 0,
    },
  ): Promise<TResponse<ResType, ErrType>[]> {
    const results: TResponse<ResType, ErrType>[] = [];
    for (let attempts = 1; attempts <= retryOpts.retries; attempts++) {
      const result = await this.send<ResType, ErrType>(url, reqArgs);
      results.push(result);
      if (
        result.success ||
        retryOpts.retries === attempts ||
        (ArrayUtil.any(retryOpts.retryWhenStatusIs) &&
          !retryOpts.retryWhenStatusIs.includes(result.statusCode as number)) ||
        (ArrayUtil.any(retryOpts.doNotRetryWhenStatusIs) &&
          retryOpts.doNotRetryWhenStatusIs.includes(result.statusCode as number))
      ) {
        break;
      }

      await AsyncUtil.waitFor(retryOpts.incrementalDelayInMs * attempts);
    }

    return results;
  }
}
