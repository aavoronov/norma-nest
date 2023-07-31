import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionPlansService } from './subscription-plans.service';

@ApiTags('subscription-plans')
@Controller('subscription-plans')
export class SubscriptionPlansController {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  @Get()
  getSubscriptionPlans() {
    return this.subscriptionPlansService.getSubscriptionPlans();
  }
}
