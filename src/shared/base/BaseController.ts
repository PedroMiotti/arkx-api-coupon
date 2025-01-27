import { Router, RouterType, Response } from '@/infra/server/core/Modules';
import { IResult } from '@/shared/http/Result';
import logger from '@/shared/logger';

export default class BaseController {
  public router: RouterType;

  constructor(name: string) {
    this.router = Router();
    logger.info(`${name} Controller initialized`);
  }

  handleResult(res: Response, result: IResult<any>): void {
    if (result.success) {
      res.status(+result.statusCode).json(result.toResultDto());
    } else {
      res.status(+result.statusCode).json(result.toResultDto());
    }
  }
}
