import CouponRepository from '../repository/prisma/Coupon.repository';

import { IssueCouponUseCase } from './IssueCoupon/index';
import { FetchSummaryUseCase } from './FetchSummary';

const issueCouponUseCase = new IssueCouponUseCase(CouponRepository);
const fetchSummaryUseCase = new FetchSummaryUseCase(CouponRepository);

export { issueCouponUseCase, fetchSummaryUseCase };
