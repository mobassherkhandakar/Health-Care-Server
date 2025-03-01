import { UserStatus } from '@prisma/client';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import httpStatus from '../../../shared/httpStatus';
import prisma from '../../../shared/prisma';
import { hashedPassword } from '../user/user.utils';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { AuthUtils } from './auth.utils';
import { sendEmail } from './sendResetMail';

const loginUser = async (paylod: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = paylod;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (
    isUserExist &&
    !(await AuthUtils.comparePasswords(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Passwords do not match');
  }
  const { id: userId, role, needPasswordChange } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    {
      userId,
      role,
      email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const refreshToken = jwtHelpers.createToken(
    {
      userId,
      role,
      email,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifyUser = null;
  try {
    verifyUser = await jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Tokens');
  }
  const { userId } = verifyUser;
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
      email: isUserExist.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  return {
    accessToken: newAccessToken,
  };
};
const changePassword = async (
  user: JwtPayload | null,
  paylod: IChangePassword,
) => {
  const { newPassword, oldPassword } = paylod;
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user?.userId,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await AuthUtils.comparePasswords(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }
  const hashdPassword = await hashedPassword(newPassword);
  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      password: hashdPassword,
      needPasswordChange: false,
    },
  });
};
const forgetPassword = async (email: string) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }
  const passResetToken = await jwtHelpers.createToken(
    {
      id: isUserExist.id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  const resetLink =
    config.reset_link + `?id=${isUserExist.id}$token=${passResetToken}`;
  await sendEmail(
    email,
    `
      <div>
        <p>Dear ${isUserExist.role},</p>
        <p>Your password reset link: <a href=${resetLink}><button>RESET PASSWORD<button/></a></p>
        <p>Thank you</p>
      </div>
  `,
  );
};
const resetPassword = async (
  paylod: { id: string; newPassword: string },
  token: string,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: paylod.id,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }
  const verifydUser = await jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret,
  );
  if (!verifydUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Something went wrong!');
  }
  const heasPassword = await hashedPassword(paylod.newPassword);
  await prisma.user.update({
    where: {
      id: paylod.id,
    },
    data: {
      password: heasPassword,
    },
  });
};
export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
