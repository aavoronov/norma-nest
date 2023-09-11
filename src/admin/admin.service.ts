import { HttpException, Injectable } from '@nestjs/common';
import { CourseFilterOption } from '../course-filter-options/entities/course-filter-option.entity';
import { CourseSection } from '../course-sections/entities/course-section.entity';
import { Course } from '../courses/entities/course.entity';
import { Favourite } from '../favourites/entities/favourite.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { QuizOptionsCategory } from '../quiz-options-categories/entities/quiz-options-category.entity';
import { QuizOption } from '../quiz-options/entities/quiz-option.entity';
import { QuizReply } from '../quiz-replies/entities/quiz-reply.entity';
import { SubscriptionPlan } from '../subscription-plans/entities/subscription-plan.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { Preview } from '../previews/entities/preview.entity';
import { LessonFile } from '../lesson-files/entities/lesson-file.entity';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { GenericData } from '../generic-data/entities/generic-data.entity';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

interface Params {
  order?: [[string, 'ASC' | 'DESC']];
  offset?: number;
  limit?: number;
  where?: any;
}

interface GetAllQueries {
  sort: string;
  range: string;
  filter: any;
}

@Injectable()
export class AdminService {
  private conditionallyModifyFilters(obj: any, keys: string[]) {
    keys.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        obj[key] = { [Op.iLike]: `%${obj[key]}%` };
      }
    });
  }

  private replaceQProperty(obj: any, newKey: string) {
    if (obj.hasOwnProperty('q')) {
      obj[newKey] = { [Op.iLike]: `%${obj['q']}%` };
      delete obj['q'];
    }
  }

  private static validPassword(password: string, userPassword: string) {
    return bcrypt.compareSync(password, userPassword);
  }

  private getParams(queries, qfield?: string) {
    const { sort, range, filter }: GetAllQueries = queries;
    const params: Params = {
      // order: [[sortArray[0], sortArray[1]]],
      // offset: start,
      // limit: end - start,
      // where: !!Object.entries(filterObject).length ? filterObject : void 0,
    };
    if (!!range) {
      const rangeArray = range.slice(1, -1).split(',');
      const start = parseInt(rangeArray[0]);
      const end = parseInt(rangeArray[1]);
      params.offset = start;
      params.limit = end - start;
    }

    if (!!sort) {
      const sortArray = sort
        .slice(1, -1)
        .split(',')
        .map((item) => item.replaceAll('"', '')) as [string, 'ASC' | 'DESC'];
      params.order = [[sortArray[0], sortArray[1]]];
    }

    // message: {
    //   [Op.iLike]: `%${query}%`,
    // },

    if (!!filter) {
      const filterObject = JSON.parse(filter);
      // params.where = !!Object.entries(filterObject).length
      //   ? filterObject
      //   : void 0;
      console.log('filterObject', filterObject);
      // Object.keys(filterObject).forEach(
      //   (key) => (filterObject[key] = { [Op.iLike]: `%${filterObject[key]}%` }),
      // );
      this.conditionallyModifyFilters(filterObject, [
        'email',
        'name',
        'title',
        'description',
      ]);

      this.replaceQProperty(filterObject, qfield);

      console.log('filterObject', filterObject);
      // console.log('first', where);
      params.where = !!Object.entries(filterObject).length
        ? filterObject
        : void 0;
    }

    return params;
  }

  async getAllUsers(queries: any) {
    try {
      const { rows: data, count } = await User.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async authenticate(body: { email: string; password: string }) {
    try {
      const user = await User.findOne({ where: { email: body.email } });
      console.log('user', user);

      if (!user) {
        throw new HttpException(
          'Неправильный логин или пароль',
          StatusCodes.NOT_FOUND,
        );
      }
      if (user.role !== 'admin') {
        throw new HttpException('Нет доступа к ресурсу', StatusCodes.FORBIDDEN);
      }

      if (user && user.isDeleted) {
        throw new HttpException('Аккаунт удален', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      const passwordMatches = AdminService.validPassword(
        body.password,
        user.password,
      );

      if (!passwordMatches) {
        throw new HttpException(
          'Неправильный логин или пароль',
          StatusCodes.NOT_FOUND,
        );
      }

      let accessToken: string;

      try {
        accessToken = jwt.sign(user.toJSON(), process.env.JWT, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      } catch (e) {
        console.log(e);
      }

      return {
        status: StatusCodes.OK,
        message: ReasonPhrases.OK,
        token: accessToken,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async getAllLessons(queries: any) {
    try {
      const { rows: data, count } = await Lesson.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllCourseFilterOptions(queries: any) {
    try {
      const { rows: data, count } = await CourseFilterOption.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllCourseSections(queries: any) {
    try {
      const { rows: data, count } = await CourseSection.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllCourses(queries: any) {
    try {
      const { rows: data, count } = await Course.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllFavourites(queries: any) {
    try {
      const { rows: data, count } = await Favourite.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllPreviews(queries: any) {
    try {
      const { rows: data, count } = await Preview.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllLessonFiles(queries: any) {
    try {
      const { rows: data, count } = await LessonFile.findAndCountAll(
        this.getParams(queries, 'title'),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllQuizOptions(queries: any) {
    try {
      const { rows: data, count } = await QuizOption.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllQuizOptionsCategories(queries: any) {
    try {
      const { rows: data, count } = await QuizOptionsCategory.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllQuizReplies(queries: any) {
    try {
      const { rows: data, count } = await QuizReply.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllSubscriptionPlans(queries: any) {
    try {
      const { rows: data, count } = await SubscriptionPlan.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllTransactions(queries: any) {
    try {
      const { rows: data, count } = await Transaction.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getAllGenericEntries(queries: any) {
    try {
      const { rows: data, count } = await GenericData.findAndCountAll(
        this.getParams(queries),
      );
      return { data, count };
    } catch (e) {
      console.log('e', e);
    }
  }

  // getFile(path: string, image: string, res: any): any {
  //   return res.sendFile(image, { root: `./uploads/${path}` });
  // }

  async getAllFiles(params: string[]) {
    try {
      console.log(params);

      // const parts = `${params['slug'] + params[0]}`.split('/');
      // const dir = parts.slice(0, -1).join('/');
      const dir = `${params['slug'] ? params['slug'] : ''}${params[0]}`;

      // console.log('parts', parts);
      console.log('dir', dir);

      const files = fs.readdirSync(`./uploads/${!!dir ? dir + '/' : ''}`, {
        withFileTypes: true,
      });
      // console.log('files', files);

      const res: {
        id: number;
        name: string;
        isDir: boolean;
        extension?: string;
      }[] = [];

      files.forEach(function (file, index) {
        console.log(file.name);
        console.log(` - isFile: ${file.isFile()}`);
        console.log(` - isDirectory: ${file.isDirectory()}`);
        const filenameDisassembled = file.name.split('.');

        const isDir = file.isDirectory();
        const name = isDir
          ? filenameDisassembled[0]
          : filenameDisassembled
              .slice(0, filenameDisassembled.length - 1)
              .join('.');
        const extension = filenameDisassembled[filenameDisassembled.length - 1];
        res.push({
          id: index,
          name: name,
          isDir: isDir,
          extension: isDir ? void 0 : extension,
        });
      });

      return { data: res };
      // const { rows: data, count } = await GenericData.findAndCountAll(
      //   this.getParams(queries),
      // );
      // return { data, count };
    } catch (e) {
      console.log('e', e);
      return e.message;
    }
  }

  // ------------------------------------------------ //

  async getOneUser(id: number) {
    try {
      const record = await User.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  //unique
  async getOneLesson(id: number) {
    try {
      const record = await Lesson.findOne({
        where: { id: id },
        include: [
          { model: Preview },
          { model: LessonFile, as: 'files', order: [['order', 'ASC']] },
        ],
      });
      const timings = JSON.parse(record.timings);
      const returnRecord: Lesson = record.toJSON();
      // console.log('record.files', returnRecord.files);
      // console.log('Array.isArray()', Array.isArray(returnRecord.files)); //true
      // console.log('returnRecord.files[0]', returnRecord.files[0]);
      const fileIds: number[] = (
        returnRecord.files as unknown as LessonFile[]
      ).map((item) => item.id);
      return { ...returnRecord, timings: timings, fileIds: fileIds };
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneCourseFilterOption(id: number) {
    try {
      const record = await CourseFilterOption.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneCourseSection(id: number) {
    try {
      const record = await CourseSection.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneCourse(id: number) {
    try {
      const record = await Course.findOne({
        where: { id: id },
        include: [{ model: Preview }],
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneFavourite(id: number) {
    try {
      const record = await Favourite.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOnePreview(id: number) {
    try {
      const record = await Preview.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneLessonFile(id: number) {
    try {
      const record = await LessonFile.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneQuizOption(id: number) {
    try {
      const record = await QuizOption.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneQuizOptionsCategory(id: number) {
    try {
      const record = await QuizOptionsCategory.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneQuizReply(id: number) {
    try {
      const record = await QuizReply.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneSubscriptionPlan(id: number) {
    try {
      const record = await SubscriptionPlan.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneTransaction(id: number) {
    try {
      const record = await Transaction.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async getOneGenericEntry(id: number) {
    try {
      const record = await GenericData.findOne({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  // ------------------------------------------------ //

  async createUser(data: any) {
    try {
      const record = await User.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  //unique
  async createLesson(data: any) {
    try {
      const timings = JSON.stringify(data.timings);
      const record = await Lesson.create({ ...data, timings: timings });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createCourseFilterOption(data: any) {
    try {
      const record = await CourseFilterOption.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createCourseSection(data: any) {
    try {
      const record = await CourseSection.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createCourse(data: any) {
    try {
      const record = await Course.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createFavourite(data: any) {
    try {
      const record = await Favourite.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createPreview(data: any) {
    try {
      const record = await Preview.create(data);
      return record;
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'Файл с таким именем уже существует',
          StatusCodes.BAD_REQUEST,
          {
            cause: new Error('Some Error'),
          },
        );
      }
      throw new HttpException(e.message, StatusCodes.BAD_REQUEST, {
        cause: new Error('Some Error'),
      });
    }
  }

  async createLessonFile(data: any) {
    try {
      const record = await LessonFile.create(data);
      return record;
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException(
          'Файл с таким именем уже существует',
          StatusCodes.BAD_REQUEST,
          {
            cause: new Error('Some Error'),
          },
        );
      }
      throw new HttpException(e.message, StatusCodes.BAD_REQUEST, {
        cause: new Error('Some Error'),
      });
    }
  }

  async createQuizOption(data: any) {
    try {
      const record = await QuizOption.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createQuizOptionsCategory(data: any) {
    try {
      const record = await QuizOptionsCategory.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createQuizReply(data: any) {
    try {
      const record = await QuizReply.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createSubscriptionPlan(data: any) {
    try {
      const record = await SubscriptionPlan.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createTransaction(data: any) {
    try {
      const record = await Transaction.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async createGenericEntry(data: any) {
    try {
      const record = await GenericData.create(data);
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  // ------------------------------------------------ //

  async deleteUser(id: number) {
    try {
      const record = await User.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteLesson(id: number) {
    try {
      const record = await Lesson.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteCourseFilterOption(id: number) {
    try {
      const record = await CourseFilterOption.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteCourseSection(id: number) {
    try {
      const record = await CourseSection.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteCourse(id: number) {
    try {
      const record = await Course.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteFavourite(id: number) {
    try {
      const record = await Favourite.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deletePreview(id: number) {
    try {
      const record = await Preview.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteLessonFile(id: number) {
    try {
      const record = await LessonFile.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteQuizOption(id: number) {
    try {
      const record = await QuizOption.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteQuizOptionsCategory(id: number) {
    try {
      const record = await QuizOptionsCategory.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteQuizReply(id: number) {
    try {
      const record = await QuizReply.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteSubscriptionPlan(id: number) {
    try {
      const record = await SubscriptionPlan.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteTransaction(id: number) {
    try {
      const record = await Transaction.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteGenericEntry(id: number) {
    try {
      const record = await GenericData.destroy({
        where: { id: id },
      });
      return record;
    } catch (e) {
      console.log('e', e);
    }
  }

  deleteFile(params: string[]) {
    // const parts = `${params['slug'] + params[0]}`.split('/');
    // const dir = parts.slice(0, -1).join('/');
    // const slug = parts[parts.length - 1];

    try {
      const dir = `${params['slug'] ? params['slug'] : ''}${params[0]}`;

      // console.log('parts', parts);
      console.log('dir', dir);
      // console.log('slug', slug);

      fs.unlink('./uploads/' + dir, (err) => {
        if (err) throw err;
        console.log('./uploads/' + dir + ' was deleted');
      });
    } catch (e) {
      console.log(e);
    }
    // return res.sendFile(slug, { root: `./uploads/` + dir + '/' });
    return { status: 204, text: 'success' };
  }

  // ------------------------------------------------ //

  async deleteMultipleUsers(queries: any) {
    try {
      const records = await User.findAll(this.getParams(queries));
      await User.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleLessons(queries: any) {
    try {
      const records = await Lesson.findAll(this.getParams(queries));
      await Lesson.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleCourseFilterOptions(queries: any) {
    try {
      const records = await CourseFilterOption.findAll(this.getParams(queries));
      await CourseFilterOption.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleCourseSections(queries: any) {
    try {
      const records = await CourseSection.findAll(this.getParams(queries));
      await CourseSection.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleCourses(queries: any) {
    try {
      const records = await Course.findAll(this.getParams(queries));
      await Course.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleFavourites(queries: any) {
    try {
      const records = await Favourite.findAll(this.getParams(queries));
      await Favourite.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultiplePreviews(queries: any) {
    try {
      const records = await Preview.findAll(this.getParams(queries));
      await Preview.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleLessonFiles(queries: any) {
    try {
      const records = await LessonFile.findAll(this.getParams(queries));
      await LessonFile.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleQuizOptions(queries: any) {
    try {
      const records = await QuizOption.findAll(this.getParams(queries));
      await QuizOption.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleQuizOptionsCategories(queries: any) {
    try {
      const records = await QuizOptionsCategory.findAll(
        this.getParams(queries),
      );
      await QuizOptionsCategory.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleQuizReplies(queries: any) {
    try {
      const records = await QuizReply.findAll(this.getParams(queries));
      await QuizReply.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleSubscriptionPlans(queries: any) {
    try {
      const records = await SubscriptionPlan.findAll(this.getParams(queries));
      await SubscriptionPlan.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleTransactions(queries: any) {
    try {
      const records = await Transaction.findAll(this.getParams(queries));
      await Transaction.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  async deleteMultipleGenericEntries(queries: any) {
    try {
      const records = await GenericData.findAll(this.getParams(queries));
      await GenericData.destroy(this.getParams(queries));
      return { data: records.map((item) => item.id) };
    } catch (e) {
      console.log('e', e);
    }
  }

  // ------------------------------------------------ //

  async updateUser(id: number, body: any) {
    try {
      const [count, data] = await User.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateLesson(id: number, body: any) {
    try {
      const timings = JSON.stringify(body.timings);
      const fileIds = body.fileIds;
      const previewId = body.preview.id;

      await Preview.update({ lessonId: null }, { where: { lessonId: id } });
      await Preview.update({ lessonId: id }, { where: { id: previewId } });

      await LessonFile.update({ lessonId: null }, { where: { lessonId: id } });
      const updateChildFile = async (fileId: number) => {
        await LessonFile.update({ lessonId: id }, { where: { id: fileId } });
      };
      await Promise.all(fileIds.map(updateChildFile));

      const [count, data] = await Lesson.update(
        { ...body, timings: timings },
        {
          where: { id: id },
          returning: true,
        },
      );

      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateCourseFilterOption(id: number, body: any) {
    try {
      const [count, data] = await CourseFilterOption.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateCourseSection(id: number, body: any) {
    try {
      const [count, data] = await CourseSection.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateCourse(id: number, body: any) {
    try {
      const previewId = body.preview.id;

      await Preview.update({ courseId: null }, { where: { courseId: id } });
      await Preview.update({ courseId: id }, { where: { id: previewId } });

      const [count, data] = await Course.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateFavourite(id: number, body: any) {
    try {
      const [count, data] = await Favourite.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updatePreview(id: number, body: any) {
    try {
      const [count, data] = await Preview.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateLessonFile(id: number, body: any) {
    try {
      const [count, data] = await LessonFile.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateQuizOption(id: number, body: any) {
    try {
      const [count, data] = await QuizOption.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateQuizOptionsCategory(id: number, body: any) {
    try {
      const [count, data] = await QuizOptionsCategory.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateQuizReply(id: number, body: any) {
    try {
      const [count, data] = await QuizReply.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateSubscriptionPlan(id: number, body: any) {
    try {
      const [count, data] = await SubscriptionPlan.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateTransaction(id: number, body: any) {
    try {
      const [count, data] = await Transaction.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }

  async updateGenericEntry(id: number, body: any) {
    try {
      const [count, data] = await GenericData.update(body, {
        where: { id: id },
        returning: true,
      });
      return { data: data[0] };
    } catch (e) {
      console.log('e', e);
    }
  }
}
