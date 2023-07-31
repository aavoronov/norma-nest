import { Module } from '@nestjs/common';
import { CourseSectionsService } from './course-sections.service';
import { CourseSectionsController } from './course-sections.controller';

@Module({
  controllers: [CourseSectionsController],
  providers: [CourseSectionsService],
})
export class CourseSectionsModule {}
