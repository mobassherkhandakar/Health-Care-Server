import { Response } from 'express';

type IResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, obj: IResponse<T>): void => {
  const response: IResponse<T> = {
    statusCode: obj.statusCode,
    success: obj.success,
    message: obj.message || null,
    meta: obj.meta || null || undefined,
    data: obj.data || null || undefined,
  };
  res.status(obj.statusCode).json(response);
};

export default sendResponse;
