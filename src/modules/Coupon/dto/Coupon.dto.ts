export class CouponDto {
  id: number;
  code: string;
  tierId: number;
  tier: CouponTierDto;
  userPhone?: string;
  issuedAt?: string;
  createdAt: string;
}

export type CouponTierDto = {
  id: number;
  name: string;
  discount: number;
};

export type CouponSummaryDto = {
  total: number;
  used: number;
  available: number;
};
