import { HttpException, Injectable } from '@nestjs/common';
import { CourseFilterOption } from '../course-filter-options/entities/course-filter-option.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Lesson } from './entities/lesson.entity';
import { Preview } from '../previews/entities/preview.entity';
import { LessonFile } from '../lesson-files/entities/lesson-file.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class LessonsService {
  constructor(private readonly usersService: UsersService) {}

  private checkSubscriptionValidity = (subscriptionThrough: Date | null) => {
    if (!subscriptionThrough) return false;

    const today = new Date();

    if (subscriptionThrough > today) return true;
    else return false;
  };

  async getAllLessons() {
    try {
      const lessons = await Lesson.findAll();
      return lessons;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async getStandaloneLessons() {
    try {
      const lessons = await Lesson.findAll({
        where: { courseId: null },
        include: [
          { model: CourseFilterOption },
          { model: CourseSection },
          { model: Preview, attributes: ['url'] },
        ],
      });
      return lessons;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async getSingleLesson(req, id: number) {
    try {
      console.log('body.id', req.body.userId);
      const user = await this.usersService.getUserByToken(
        req.headers.authorization,
      );

      const lesson = await Lesson.findOne({
        where: { id: id },
        include: [
          { model: Preview, attributes: ['url'] },
          { model: LessonFile, attributes: ['title', 'url', 'order'] },
        ],
        attributes: [
          'id',
          'title',
          'video',
          'description',
          'duration',
          'timings',
          'duration',
          'isPaid',
        ],
      });

      const hasAccess =
        this.checkSubscriptionValidity(user.subscriptionThrough) ||
        !lesson.isPaid;
      const data = lesson.toJSON();

      return !!hasAccess ? data : { ...data, video: null };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
