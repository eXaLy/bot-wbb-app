import * as winston from 'winston';

const formats = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple(),
);
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: formats }),
    new winston.transports.File({
      filename: 'output/all.log',
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      level: 'error',
      format: winston.format.simple(),
      filename: 'output/error.log',
    }),
  ],
});

export default logger;
