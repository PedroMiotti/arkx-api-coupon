import buildDevLogger from './logger.dev';
import buildProdLogger from './logger.prod';
import { Logger } from 'winston';

import dotenv from 'dotenv';
dotenv.config();

let logger: Logger;
let isDevEnvironment = process.env.ENVIRONMENT === 'development';

if (isDevEnvironment) logger = buildDevLogger;
else logger = buildProdLogger;

export default logger;
