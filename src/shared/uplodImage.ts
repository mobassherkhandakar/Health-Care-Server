/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import config from '../config';
import ApiError from '../errors/ApiError';
import httpStatus from './httpStatus';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const sendImageToCloudinary = (
  file: any,
  folder: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,

      { public_id: file.filename, folder: folder },
      function (error, result) {
        fs.unlink(file.path, err => {
          if (err) {
            console.log(err);
          } else {
            console.log('File is deleted.');
          }
        });
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
      },
    );
  });
};

const nameControlle = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), '/uploads/'));
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLocaleLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();
    cb(null, fileName + fileExt);
  },
});
const storage = multer({
  storage: nameControlle,
  limits: {
    fileSize: 5000000,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(new ApiError(httpStatus.BAD_REQUEST, 'only allow jpg'));
    }
  },
});

export const upload = storage;
