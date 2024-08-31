import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/not-Found';
const app: Application = express();
//cors

app.use(cors());
app.use(cookieParser());

//perser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
// app.use('/api/v1/');

//global error handler
app.use(globalErrorHandler);
//not found
app.use(notFound);
export default app;
