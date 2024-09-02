import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import { AuthController } from './auth.controller';
const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/refreshToken', AuthController.refreshToken);
router.post(
  '/change-password',
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  AuthController.changePassword,
);
router.post('/forgot-password', AuthController.forgetPassword);

export const AuthRouter = router;
