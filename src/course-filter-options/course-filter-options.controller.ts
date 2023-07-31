import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseFilterOptionsService } from './course-filter-options.service';

@ApiTags('course-filter-options')
@Controller('course-filter-options')
export class CourseFilterOptionsController {
  constructor(
    private readonly courseFilterOptionsService: CourseFilterOptionsService,
  ) {}

  @Get()
  getFilterOptions() {
    return this.courseFilterOptionsService.getFilterOptions();
  }
}
