import { HttpException, Injectable } from '@nestjs/common';
import { CourseFilterOption } from './entities/course-filter-option.entity';

@Injectable()
export class CourseFilterOptionsService {
  async getFilterOptions() {
    try {
      const filters = CourseFilterOption.findAll({
        attributes: ['id', 'title'],
      });
      return filters;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
