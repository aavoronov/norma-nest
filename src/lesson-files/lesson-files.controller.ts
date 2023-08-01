import { Controller } from '@nestjs/common';
import { LessonFilesService } from './lesson-files.service';

@Controller('lesson-files')
export class LessonFilesController {
  constructor(private readonly lessonFilesService: LessonFilesService) {}
}
