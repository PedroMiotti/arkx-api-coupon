import BaseController from '@/shared/base/BaseController';

import CouponController from './Coupon/Coupon.controller';
import HealthController from './Health/Health.controller';

export const controllers: BaseController[] = [CouponController, HealthController];
