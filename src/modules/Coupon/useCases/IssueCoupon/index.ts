import { CouponDto } from '../../dto/Coupon.dto';
import { CouponTier } from '../../enum';
import { ICouponRepository } from '../../repository/ICouponRepository';

import { IResult, Result } from '@/shared/http/Result';

export class IssueCouponUseCase {
  private userCouponLimit = 3;

  private couponTierUseMap: { [key: number]: number } = {
    [CouponTier.THIRTY_PERCENT]: 3,
    [CouponTier.FIFTY_PERCENT]: 2,
    [CouponTier.HUNDRED_PERCENT]: 1,
  };

  constructor(private readonly couponRepository: ICouponRepository) {}

  public async execute(userPhone: string): Promise<IResult<CouponDto>> {
    const result = new Result<CouponDto>();

    const userIssuedCoupons = await this.couponRepository.fetchAll({ userPhone });
    const issuedCouponCount = userIssuedCoupons.length;

    if (issuedCouponCount >= this.userCouponLimit) {
      result.setError('User reached coupon limit', 400);
      return result;
    }

    for (const coupon of userIssuedCoupons) {
      const couponTierUseCount = this.couponTierUseMap[coupon.tier.id];

      if (couponTierUseCount <= 0) {
        continue;
      }

      this.couponTierUseMap[coupon.tier.id] = couponTierUseCount - 1;
    }

    const availableCouponTiers = Object.keys(this.couponTierUseMap).filter(
      (key) => this.couponTierUseMap[Number(key)] > 0,
    );

    if (availableCouponTiers.length === 0) {
      result.setError('User reached coupon limit', 400);
      return result;
    }

    const randomCouponTier = availableCouponTiers[Math.floor(Math.random() * availableCouponTiers.length)];

    const availableCoupon = await this.couponRepository.fetchAvailable(Number(randomCouponTier));

    if (!availableCoupon) {
      result.setError('No available coupon', 400);
      return result;
    }

    const issuedCoupon = await this.couponRepository.update(availableCoupon.id, {
      userPhone,
      issuedAt: new Date().toISOString(),
    });

    if (!issuedCoupon) {
      result.setError('Failed to issue coupon', 500);
      return result;
    }

    result.setData(issuedCoupon, 200, 'Coupon issued successfully');

    return result;
  }
}
