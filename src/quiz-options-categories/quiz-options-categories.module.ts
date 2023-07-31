import { Module } from '@nestjs/common';
import { QuizOptionsCategoriesController } from './quiz-options-categories.controller';
import { QuizOptionsCategoriesService } from './quiz-options-categories.service';

@Module({
  controllers: [QuizOptionsCategoriesController],
  providers: [QuizOptionsCategoriesService],
})
export class QuizOptionsCategoriesModule {}
