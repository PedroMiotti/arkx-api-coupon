import { CouponDto, CouponSummaryDto } from '../dto/Coupon.dto';
import { FetchCouponRequestDto, UpdateCouponRequestDto } from '../dto/CouponRequest.dto';

export interface ICouponRepository {
  fetchSummary: () => Promise<CouponSummaryDto>;
  fetchAll: (params?: FetchCouponRequestDto) => Promise<CouponDto[]>;
  fetchAvailable: (tier: number) => Promise<CouponDto | null>;
  update: (id: number, dto: UpdateCouponRequestDto) => Promise<CouponDto | null>;
}
