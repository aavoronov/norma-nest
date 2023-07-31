import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './core/database/database.module';
import { VerificationsModule } from './verifications/verifications.module';
import { MailerModule } from './mailer/mailer.module';
import { QuizRepliesModule } from './quiz-replies/quiz-replies.module';
import { CourseSectionsModule } from './course-sections/course-sections.module';
import { CourseFilterOptionsModule } from './course-filter-options/course-filter-options.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { FavouritesModule } from './favourites/favourites.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { QuizOptionsModule } from './quiz-options/quiz-options.module';
import { TransactionsModule } from './transactions/transactions.module';
import { QuizOptionsCategoriesModule } from './quiz-options-categories/quiz-options-categories.module';
import { RestorationKeysModule } from './restoration-keys/restoration-keys.module';
import { AdminModule } from './admin/admin.module';
import { PreviewsModule } from './previews/previews.module';
import { LessonFilesModule } from './lesson-files/lesson-files.module';
import { GenericDataModule } from './generic-data/generic-data.module';
import { AuthMiddleware } from './utils/middleware/auth.middleware';
import { ConfigModule } from '@nestjs/config';

const modules = [
  DatabaseModule,
  UsersModule,
  VerificationsModule,
  RestorationKeysModule,
  MailerModule,
  QuizOptionsCategoriesModule,
  QuizOptionsModule,
  QuizRepliesModule,
  CourseSectionsModule,
  CourseFilterOptionsModule,
  CoursesModule,
  LessonsModule,
  FavouritesModule,
  SubscriptionPlansModule,
  TransactionsModule,
  AdminModule,
  PreviewsModule,
  LessonFilesModule,
  GenericDataModule,
];

const modulesToApplyAuthMiddlewareTo = [
  // DatabaseModule,
  // UsersModule,
  // VerificationsModule,
  // RestorationKeysModule,
  // MailerModule,

  // !QuizOptionsCategoriesModule,
  // QuizOptionsModule,
  // QuizRepliesModule,
  // CourseSectionsModule,
  // CourseFilterOptionsModule,
  // CoursesModule,
  // LessonsModule,
  // FavouritesModule,
  // SubscriptionPlansModule,
  // TransactionsModule,
  AdminModule,
  PreviewsModule,
  LessonFilesModule,
  GenericDataModule,
];

@Module({
  imports: [ConfigModule.forRoot(), ...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        '/course-filter-options/',
        '/course-sections/',
        '/courses/',
        '/lessons/',
        '/favourites/',
        '/transactions/',
        '/subscription-plans/',
        '/users/reauth',
        '/users/edit',
        '/users/send-verification',
        '/users/subscribe',
        { path: '/users/', method: RequestMethod.DELETE },
        '/generic-data/',
      );
  }
}
// users: apply:   @Get('reauth') @Patch('edit') @Get('send-verification') @Post('subscribe') @Delete()
// users: exclude: @Post('check') @Post() @Post('auth') @Get('verify') @Post('request-restoration') @Get('restore') @Post('restore')
//  '/quiz-options-categories/'
