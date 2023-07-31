import { HttpException, Injectable } from '@nestjs/common';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Course } from './entities/course.entity';
import { Preview } from '../previews/entities/preview.entity';
import { LessonFile } from '../lesson-files/entities/lesson-file.entity';

@Injectable()
export class CoursesService {
  async getSingleCourse(id: number) {
    try {
      const course = await Course.findOne({
        where: { id: id },
        include: [
          {
            model: Lesson,
            include: [
              { model: Preview, attributes: ['url'] },
              { model: LessonFile, attributes: ['title', 'url', 'order'] },
            ],
            attributes: ['id', 'title', 'duration', 'isPaid', 'order'],
          },
          { model: Preview, attributes: ['url'] },
        ],
        attributes: ['id', 'title', 'description'],
      });
      return course;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
