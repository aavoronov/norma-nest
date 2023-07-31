import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [LessonsController],
  providers: [LessonsService],
  imports: [UsersModule],
})
export class LessonsModule {}
