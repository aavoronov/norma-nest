import { HttpException, Injectable } from '@nestjs/common';
import { SubscriptionPlan } from './entities/subscription-plan.entity';

@Injectable()
export class SubscriptionPlansService {
  async getSubscriptionPlans() {
    try {
      const plans = await SubscriptionPlan.findAll({
        attributes: [
          'id',
          'term',
          'humanFriendlyTerm',
          'price',
          'isPopular',
          'isGoodOffer',
        ],
      });
      return plans;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
