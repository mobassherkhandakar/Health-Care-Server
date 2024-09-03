import { Admin, Doctor, Patient, UserRole } from '@prisma/client';
import { Request } from 'express';
import prisma from '../../../shared/prisma';
import { sendImageToCloudinary } from '../../../shared/uplodImage';
import { hashedPassword } from './user.utils';

const createAdmin = async (req: Request): Promise<Admin> => {
  if (req.file) {
    const { secure_url } = await sendImageToCloudinary(req.file, '/user/admin');
    req.body.admin.profilePhoto = secure_url;
  }
  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async transactionClint => {
    await transactionClint.user.create({
      data: {
        email: req.body?.admin?.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });
    const newAdmin = await transactionClint.admin.create({
      data: req.body.admin,
    });
    return newAdmin;
  });
  return result;
};
const createDoctor = async (req: Request): Promise<Doctor> => {
  if (req.file) {
    const { secure_url } = await sendImageToCloudinary(req.file, 'user/doctor');
    req.body.doctor.profilePhoto = secure_url;
  }
  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async transactionClint => {
    await transactionClint.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashPassword,
        role: UserRole.DOCTOR,
      },
    });
    const newDoctor = await transactionClint.doctor.create({
      data: req.body.doctor,
    });
    return newDoctor;
  });
  return result;
};
const creatPatient = async (req: Request): Promise<Patient> => {
  if (req.file) {
    const { secure_url } = await sendImageToCloudinary(
      req.file,
      'user/patient',
    );
    req.body.patient.profilePhoto = secure_url;
  }
  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async transactionClint => {
    await transactionClint.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword,
        role: UserRole.DOCTOR,
      },
    });
    const newPatient = await transactionClint.patient.create({
      data: req.body.patient,
    });
    return newPatient;
  });
  return result;
};

export const UserService = {
  createAdmin,
  createDoctor,
  creatPatient,
};
