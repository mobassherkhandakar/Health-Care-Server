import { Server } from 'http';
import app from './app';
import config from './config';
import { errorlogger, logger } from './shared/logger';

process.on('uncaughtException', error => {
  errorlogger.error(error);
  process.exit(1);
});

let server: Server;
async function bootsraps() {
  try {
    server = app.listen(config.port, () => {
      logger.info(`Application app listening on port ${config.port}`);
    });
  } catch (error) {
    errorlogger.error('Faild to connect database connection', error);
  }
  process.on('unhandledRejection', error => {
    logger.error(error);
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
process.on('SIGTERM', () => {
  errorlogger.error('SIGTERM is Recived');
  if (server) {
    server.close();
  }
});

bootsraps();
