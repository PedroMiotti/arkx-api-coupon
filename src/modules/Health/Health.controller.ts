import { NextFunction, Request, Response } from 'express';
import BaseController from '../../shared/base/BaseController';

class HealthController extends BaseController {
  private readonly baseUrl: string;

  constructor() {
    super('Health');
    this.baseUrl = 'healthcheck';

    this.initializeRoutes();
  }

  checkHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const healthCheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        environment: process.env.ENVIRONMENT,
      };
      
      res.status(200).json(healthCheck);
    } catch (e) {
      next(e);
    }
  };

  private initializeRoutes(): void {
    this.router.get(`/${this.baseUrl}`, this.checkHealth);
  }
}

export default new HealthController();
