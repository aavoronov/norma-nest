import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseSectionsService } from './course-sections.service';

@ApiTags('course-sections')
@Controller('course-sections')
export class CourseSectionsController {
  constructor(private readonly courseSectionsService: CourseSectionsService) {}

  @Get()
  getAllSections() {
    return this.courseSectionsService.getAllSections();
  }
}
