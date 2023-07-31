import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuizOptionsCategoriesService } from './quiz-options-categories.service';

@ApiTags('quiz-options-categories')
@Controller('quiz-options-categories')
export class QuizOptionsCategoriesController {
  constructor(
    private readonly quizOptionsCategoriesService: QuizOptionsCategoriesService,
  ) {}

  @Get()
  getQuizOptions() {
    return this.quizOptionsCategoriesService.getQuizOptions();
  }
}
