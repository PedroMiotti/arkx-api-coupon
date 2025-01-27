import morphism from 'morphism';

import { CouponDto, CouponSummaryDto } from '../../dto/Coupon.dto';
import { FetchCouponRequestDto, UpdateCouponRequestDto } from '../../dto/CouponRequest.dto';

import { prisma } from '@/infra/database/prisma';

import { toDto, toEntity } from './Coupon.schema';
import { ICouponRepository } from '../ICouponRepository';
import { Prisma } from '@prisma/client';

class CouponRepository implements ICouponRepository {
  async fetchAll(params?: FetchCouponRequestDto): Promise<CouponDto[]> {
    const whereQuery: Prisma.CouponWhereInput = {
      ...(params?.userPhone && { UserPhone: params.userPhone }),
    };

    const coupons = await prisma.coupon.findMany({
      where: whereQuery,
      include: {
        Tier: true,
      },
    });

    return morphism(toDto, coupons);
  }

  async fetchSummary(): Promise<CouponSummaryDto> {
    const total = await prisma.coupon.count();
    const used = await prisma.coupon.count({ where: { UserPhone: { not: null } } });
    const available = total - used;

    return {
      total,
      used,
      available,
    };
  }

  async update(id: number, dto: UpdateCouponRequestDto): Promise<CouponDto | null> {
    const updatedCoupon = await prisma.coupon.update({
      where: { Id: id },
      data: morphism(toEntity, dto),
      include: {
        Tier: true,
      },
    });

    if (updatedCoupon) return morphism(toDto, updatedCoupon);

    return null;
  }

  async fetchAvailable(tier: number): Promise<CouponDto | null> {
    const coupon = await prisma.coupon.findFirst({
      where: {
        UserPhone: null,
        IssuedAt: null,
        TierId: tier,
      },
      include: {
        Tier: true,
      },
    });

    if (coupon) return morphism(toDto, coupon);

    return null;
  }
}

export default new CouponRepository();
