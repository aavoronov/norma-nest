import { Injectable } from '@nestjs/common';
import { QuizOption } from '../quiz-options/entities/quiz-option.entity';
import { QuizOptionsCategory } from './entities/quiz-options-category.entity';

@Injectable()
export class QuizOptionsCategoriesService {
  async getQuizOptions() {
    const options = await QuizOptionsCategory.findAll({
      attributes: ['title', 'subtitle', 'isMultipleChoice'],
      include: [{ model: QuizOption, attributes: ['option'] }],
    });
    return options;
  }
}
