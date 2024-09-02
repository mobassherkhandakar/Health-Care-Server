/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import config from '../../../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: config.email,
      pass: config.app_pass,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: config.email,
    to,
    subject: 'Reset Password Link',
    html,
  });

  console.log('Message sent: %s', info.messageId);
};
