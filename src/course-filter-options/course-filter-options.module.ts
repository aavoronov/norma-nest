import { Module } from '@nestjs/common';
import { CourseFilterOptionsController } from './course-filter-options.controller';
import { CourseFilterOptionsService } from './course-filter-options.service';

@Module({
  controllers: [CourseFilterOptionsController],
  providers: [CourseFilterOptionsService],
})
export class CourseFilterOptionsModule {}
