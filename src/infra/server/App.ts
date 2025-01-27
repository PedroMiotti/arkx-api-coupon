import cors from 'cors';
import helmet from 'helmet';

import { Server, Application, BodyParser } from './core/Modules';

import HandlerErrorMiddleware from '../middleware/handleError';

import config from '../config';

import logger from '@/shared/logger';
import AppSettings from '@/shared/settings/AppSettings';
import BaseController from '@/shared/base/BaseController';

export default class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.setup();
    this.app = Server();
    this.app.set('trust proxy', true);
    this.loadMiddleware();
    this.loadControllers(controllers);
    this.loadErrorHandler();
  }

  public loadMiddleware(): void {
    this.app.use(helmet());
    this.app.use(BodyParser({ limit: '50mb' }));
    this.app.use(cors());
  }

  private loadControllers(controllers: BaseController[]): void {
    controllers.forEach((controller) => {
      this.app.use(AppSettings.ServerRoot, controller.router);
    });
  }

  private loadErrorHandler(): void {
    this.app.use(HandlerErrorMiddleware.handler);
  }

  private setup(): void {
    AppSettings.init(config);
  }

  public listen(): void {
    this.app.listen(config.server.Port, () => {
      logger.info(`Server running on ${AppSettings.ServerHost}:${AppSettings.ServerPort}${AppSettings.ServerRoot}`);
    });
  }

  private runServices(): void {
    this.listen();
  }

  public start(): void {
    this.runServices();
  }
}
