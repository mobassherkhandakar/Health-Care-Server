import express, { NextFunction, Request, Response } from 'express';
import { upload } from '../../../shared/uplodImage';
import { UserController } from './user.controller';
const router = express.Router();
router.post(
  '/create-admin',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.createAdmin(req, res, next);
  },
);
router.post(
  '/create-doctor',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.createDoctor(req, res, next);
  },
);
router.post(
  '/create-patient',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return UserController.createPatient(req, res, next);
  },
);

export const UserRouter = router;
