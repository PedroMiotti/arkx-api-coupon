import { NextFunction, Response, Request } from 'express';

import { fetchSummaryUseCase, issueCouponUseCase } from './useCases';

import { issueCouponSchema } from './schema/Coupon.schema';

import BaseController from '@/shared/base/BaseController';
import { TypedRequest } from '@/shared/http/TypedRequest';
import { validate } from '@/infra/middleware/validation';

class CouponController extends BaseController {
  private readonly baseUrl: string;

  constructor() {
    super('Coupon');
    this.baseUrl = 'coupon';
    this.initializeRoutes();
  }

  issue = async (req: TypedRequest<typeof issueCouponSchema>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body;

      this.handleResult(res, await issueCouponUseCase.execute(body.userPhone));
    } catch (e) {
      next(e);
    }
  };

  fetchSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.handleResult(res, await fetchSummaryUseCase.execute());
    } catch (e) {
      next(e);
    }
  };

  private initializeRoutes() {
    this.router.post(`/${this.baseUrl}/issue`, [validate(issueCouponSchema)], this.issue);
    this.router.get(`/${this.baseUrl}/summary`, this.fetchSummary);
  }
}

export default new CouponController();
