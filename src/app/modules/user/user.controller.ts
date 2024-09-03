import { Admin, Doctor, Patient } from '@prisma/client';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import httpStatus from '../../../shared/httpStatus';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createAdmin(req);

  sendResponse<Admin>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createDoctor(req);

  sendResponse<Doctor>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.creatPatient(req);

  sendResponse<Patient>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient created successfully',
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
};
