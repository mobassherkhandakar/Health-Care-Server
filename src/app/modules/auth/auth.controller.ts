import { Request, Response } from 'express';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import httpStatus from '../../../shared/httpStatus';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken, ...result } = await AuthService.loginUser(req.body);
  const coockisOption = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, coockisOption);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  const coockisOption = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, coockisOption);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  await AuthService.changePassword(user, passwordData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully!',
    data: {
      status: 200,
      message: 'Password changed successfully!',
    },
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
