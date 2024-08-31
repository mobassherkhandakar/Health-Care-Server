import { NextFunction, Request, Response } from 'express';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelper';
import httpStatus from '../../shared/httpStatus';

const auth =
  (...requiredRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      let verifydUser = null;
      verifydUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      if (!verifydUser) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
      }
      req.user = verifydUser;
      if (requiredRole.length && !requiredRole.includes(verifydUser?.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
