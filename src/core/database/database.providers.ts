import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig, IConfigSignature } from './database.config';
import { User } from '@/src/users/entities/user.entity';

import { Verification } from '@/src/verifications/entities/verification.entity';
import { QuizReply } from '@/src/quiz-replies/entities/quiz-reply.entity';
import { QuizOption } from '@/src/quiz-options/entities/quiz-option.entity';
import { CourseFilterOption } from '@/src/course-filter-options/entities/course-filter-option.entity';
import { CourseSection } from '@/src/course-sections/entities/course-section.entity';
import { Course } from '@/src/courses/entities/course.entity';
import { Lesson } from '@/src/lessons/entities/lesson.entity';
import { QuizOptionsCategory } from '@/src/quiz-options-categories/entities/quiz-options-category.entity';
import { SubscriptionPlan } from '@/src/subscription-plans/entities/subscription-plan.entity';
import { Transaction } from '@/src/transactions/entities/transaction.entity';
import { RestorationKey } from '@/src/restoration-keys/entities/restoration-key.entity';
import { Favourite } from '@/src/favourites/entities/favourite.entity';
import { LessonFile } from '@/src/lesson-files/entities/lesson-file.entity';
import { Preview } from '@/src/previews/entities/preview.entity';
import { GenericData } from '@/src/generic-data/entities/generic-data.entity';

const entities = [
  User,
  Verification,
  QuizOption,
  QuizOptionsCategory,
  QuizReply,
  CourseFilterOption,
  CourseSection,
  Course,
  Lesson,
  SubscriptionPlan,
  Transaction,
  RestorationKey,
  Favourite,
  LessonFile,
  Preview,
  GenericData,
];
export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels(entities);
      await sequelize.sync();
      // await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];
