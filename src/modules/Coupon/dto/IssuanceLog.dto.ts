import { CouponResponse } from "../enum";

export class IssuanceLogDto {
  id: number;
  couponId?: number;
  userPhone: string;
  response: CouponResponse;
  createdAt: string;
}
