import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthMiddleware } from '../utils/middleware/auth.middleware';
import { AdminMiddleware } from '../utils/middleware/admin.middleware';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude({ path: '/admin/authenticate', method: RequestMethod.POST })
    //   .forRoutes(AdminController);
    // consumer
    //   .apply(AdminMiddleware)
    //   .exclude({ path: '/admin/authenticate', method: RequestMethod.POST })
    //   .forRoutes(AdminController);
  }
}
