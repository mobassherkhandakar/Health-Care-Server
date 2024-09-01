import { Request, Response } from 'express';
import httpStatus from '../../shared/httpStatus';

const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Api not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'Not found',
      },
    ],
  });
};

export default notFound;
