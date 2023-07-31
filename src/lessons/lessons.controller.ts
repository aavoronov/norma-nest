import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  getAllLessons() {
    return this.lessonsService.getAllLessons();
  }

  @Get('standalone')
  getStandaloneLessons() {
    return this.lessonsService.getStandaloneLessons();
  }

  @Get(':id')
  getSingleLesson(@Req() req, @Param('id') id: string) {
    return this.lessonsService.getSingleLesson(req, +id);
  }
}
