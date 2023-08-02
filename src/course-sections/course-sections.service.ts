import { HttpException, Injectable } from '@nestjs/common';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { CourseSection } from './entities/course-section.entity';
import { Preview } from '../previews/entities/preview.entity';
import { Op } from 'sequelize';

@Injectable()
export class CourseSectionsService {
  async getAllSections() {
    try {
      const sections = await CourseSection.findAll({
        attributes: ['id', 'section'],
        include: [
          {
            model: Lesson,
            attributes: [
              'id',
              'title',
              'duration',
              'createdAt',
              'filterId',
              'courseId',
            ],
            where: { courseId: { [Op.ne]: null } },
            as: 'lessons',
            include: [{ model: Preview, attributes: ['url'] }],
          },
          {
            model: Course,
            attributes: ['id', 'title', 'createdAt', 'filterId'],
            include: [
              {
                model: Lesson,
                attributes: ['id'],
              },
              { model: Preview, attributes: ['url'] },
            ],
          },
        ],
      });
      return sections;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
