import { Coupon, Prisma } from '@prisma/client';
import { createSchema } from 'morphism';

import { CouponDto } from '../../dto/Coupon.dto';
import { UpdateCouponRequestDto } from '../../dto/CouponRequest.dto';

export const CouponIncludes = {
  Tier: true,
};

export type CouponWithTier = Prisma.CouponGetPayload<{
  include: typeof CouponIncludes;
}>;

export const toDto = createSchema<CouponDto, CouponWithTier>({
  id: 'Id',
  code: 'Code',
  tierId: 'TierId',
  issuedAt: 'IssuedAt',
  userPhone: 'UserPhone',
  tier: (entity) => ({
    id: entity.Tier.Id,
    name: entity.Tier.Name,
    discount: entity.Tier.Discount,
  }),
  createdAt: 'CreatedAt',
});

export const toEntity = createSchema<Coupon, UpdateCouponRequestDto>({
  Id: 'id',
  Code: 'code',
  IssuedAt: 'issuedAt',
  TierId: 'tierId',
  UserPhone: 'userPhone',
  CreatedAt: 'createdAt',
  DeletedAt: 'deletedAt',
});
