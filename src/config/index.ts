import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.SALT_ROUND,
  reset_link: process.env.RESET_LINK,
  email: process.env.EMAIL,
  app_pass: process.env.APP_PASS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.REFRESH_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
  },
};
