import { IResult, Result } from '@/shared/http/Result';
import { ICouponRepository } from '../../repository/ICouponRepository';
import { CouponSummaryDto } from '../../dto/Coupon.dto';

export class FetchSummaryUseCase {
  constructor(private readonly couponRepository: ICouponRepository) {}

  public async execute(): Promise<IResult<CouponSummaryDto>> {
    const result = new Result<CouponSummaryDto>();

    const summary = await this.couponRepository.fetchSummary();

    result.setData(summary, 200);
    result.setMessage('Fetched coupon summary successfully', 200);

    return result;
  }
}
