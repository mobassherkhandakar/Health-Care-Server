/* eslint-disable @typescript-eslint/no-explicit-any */
import { Admin, UserRole } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { hashedPassword } from './user.utils';

const createAdmin = async (data: any): Promise<Admin> => {
  const hashPassword = await hashedPassword(data.password);
  const result = await prisma.$transaction(async transactionClint => {
    await transactionClint.user.create({
      data: {
        email: data?.admin?.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });
    const newAdmin = await transactionClint.admin.create({
      data: data.admin,
    });
    return newAdmin;
  });
  return result;
};

export const UserService = {
  createAdmin,
};
