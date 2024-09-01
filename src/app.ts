import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/not-Found';
import routes from './app/routers';
import morgan from 'morgan';
const app: Application = express();
//cors

app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

//perser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use('/api/v1/', routes);

//global error handler
app.use(globalErrorHandler);
//not found
app.use(notFound);
export default app;
