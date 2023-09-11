import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppendCountHeaderInterceptor } from '../interceptors/append-count-header';
import { AdminService } from './admin.service';

@UseInterceptors(new AppendCountHeaderInterceptor())
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('uploads/:path/:name')
  seeUploadedFile(
    @Param('path') path: string,
    @Param('name') image: string,
    @Res() res: any,
  ) {
    return res.sendFile(image, { root: `./uploads/${path}` });
  }

  @Post('authenticate')
  authenticate(@Body() body: { email: string; password: string }) {
    return this.adminService.authenticate(body);
  }

  @Get('users')
  getAllUsers(@Query() queries: any) {
    return this.adminService.getAllUsers(queries);
  }

  @Get('lessons')
  getAllLessons(@Query() queries: any) {
    return this.adminService.getAllLessons(queries);
  }

  @Get('course-filter-options')
  getAllCourseFilterOptions(@Query() queries: any) {
    return this.adminService.getAllCourseFilterOptions(queries);
  }

  @Get('course-sections')
  getAllCourseSections(@Query() queries: any) {
    return this.adminService.getAllCourseSections(queries);
  }

  @Get('courses')
  getAllCourses(@Query() queries: any) {
    return this.adminService.getAllCourses(queries);
  }

  @Get('favourites')
  getAllFavourites(@Query() queries: any) {
    return this.adminService.getAllFavourites(queries);
  }

  @Get('previews')
  getAllPreviews(@Query() queries: any) {
    return this.adminService.getAllPreviews(queries);
  }

  @Get('lesson-files')
  getAllLessonFiles(@Query() queries: any) {
    return this.adminService.getAllLessonFiles(queries);
  }

  @Get('quiz-options')
  getAllQuizOptions(@Query() queries: any) {
    return this.adminService.getAllQuizOptions(queries);
  }

  @Get('quiz-options-categories')
  getAllQuizOptionsCategories(@Query() queries: any) {
    return this.adminService.getAllQuizOptionsCategories(queries);
  }

  @Get('quiz-replies')
  getAllQuizReplies(@Query() queries: any) {
    return this.adminService.getAllQuizReplies(queries);
  }

  @Get('subscription-plans')
  getAllSubscriptionPlans(@Query() queries: any) {
    return this.adminService.getAllSubscriptionPlans(queries);
  }

  @Get('transactions')
  getAllTransactions(@Query() queries: any) {
    return this.adminService.getAllTransactions(queries);
  }

  @Get('generic-data')
  getAllGenericEntries(@Query() queries: any) {
    return this.adminService.getAllGenericEntries(queries);
  }

  @Get('files/:slug?*')
  getAllFiles(@Param() params: string[]) {
    return this.adminService.getAllFiles(params);
  }

  // ------------------------------------------- //

  @Get('users/:id')
  getOneUser(@Param('id') id: number) {
    return this.adminService.getOneUser(id);
  }

  @Get('lessons/:id')
  getOneLesson(@Param('id') id: number) {
    return this.adminService.getOneLesson(id);
  }

  @Get('course-filter-options/:id')
  getOneCourseFilterOption(@Param('id') id: number) {
    return this.adminService.getOneCourseFilterOption(id);
  }

  @Get('course-sections/:id')
  getOneCourseSection(@Param('id') id: number) {
    return this.adminService.getOneCourseSection(id);
  }

  @Get('courses/:id')
  getOneCourse(@Param('id') id: number) {
    return this.adminService.getOneCourse(id);
  }

  @Get('favourites/:id')
  getOneFavourite(@Param('id') id: number) {
    return this.adminService.getOneFavourite(id);
  }

  @Get('previews/:id')
  getOnePreview(@Param('id') id: number) {
    return this.adminService.getOnePreview(id);
  }

  @Get('lesson-files/:id')
  getOneLessonFile(@Param('id') id: number) {
    return this.adminService.getOneLessonFile(id);
  }

  @Get('quiz-options/:id')
  getOneQuizOption(@Param('id') id: number) {
    return this.adminService.getOneQuizOption(id);
  }

  @Get('quiz-options-categories/:id')
  getOneQuizOptionsCategory(@Param('id') id: number) {
    return this.adminService.getOneQuizOptionsCategory(id);
  }

  @Get('quiz-replies/:id')
  getOneQuizReply(@Param('id') id: number) {
    return this.adminService.getOneQuizReply(id);
  }

  @Get('subscription-plans/:id')
  getOneSubscriptionPlan(@Param('id') id: number) {
    return this.adminService.getOneSubscriptionPlan(id);
  }

  @Get('transactions/:id')
  getOneTransaction(@Param('id') id: number) {
    return this.adminService.getOneTransaction(id);
  }

  @Get('generic-data/:id')
  getOneGenericEntry(@Param('id') id: number) {
    return this.adminService.getOneGenericEntry(id);
  }

  // ------------------------------------------- //

  @Post('users')
  createUser(@Body() data: any) {
    return this.adminService.createUser(data);
  }

  @Post('lessons')
  createLesson(@Body() data: any) {
    return this.adminService.createLesson(data);
  }

  @Post('course-filter-options')
  createCourseFilterOption(@Body() data: any) {
    return this.adminService.createCourseFilterOption(data);
  }

  @Post('course-sections')
  createCourseSection(@Body() data: any) {
    return this.adminService.createCourseSection(data);
  }

  @Post('courses')
  createCourse(@Body() data: any) {
    return this.adminService.createCourse(data);
  }

  @Post('favourites')
  createFavourite(@Body() data: any) {
    return this.adminService.createFavourite(data);
  }

  @Post('previews')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/previews/',
        filename: (req, file, cb) => {
          try {
            const dbFileName = file.originalname.replace(
              /[^a-zA-Z0-9 $-_.+!'(),]/g,
              '-',
            );
            req.body.url = dbFileName;
            cb(null, `${dbFileName}`);
          } catch (e) {
            // console.log(e);
          }
        },
      }),
    }),
  )
  createPreview(@Body() data: any) {
    return this.adminService.createPreview(data);
  }

  @Post('lesson-files')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/lesson-files/',
        filename: (req, file, cb) => {
          try {
            const dbFileName = file.originalname.replace(
              /[^a-zA-Z0-9 $-_.+!'(),]/g,
              '-',
            );
            req.body.url = dbFileName;
            cb(null, `${dbFileName}`);
          } catch (e) {
            // console.log(e);
          }
        },
      }),
    }),
  )
  createLessonFile(@Body() data: any) {
    return this.adminService.createLessonFile(data);
  }

  @Post('quiz-options')
  createQuizOption(@Body() data: any) {
    return this.adminService.createQuizOption(data);
  }

  @Post('quiz-options-categories')
  createQuizOptionsCategory(@Body() data: any) {
    return this.adminService.createQuizOptionsCategory(data);
  }

  @Post('quiz-replies')
  createQuizReply(@Body() data: any) {
    return this.adminService.createQuizReply(data);
  }

  @Post('subscription-plans')
  createSubscriptionPlan(@Body() data: any) {
    return this.adminService.createSubscriptionPlan(data);
  }

  @Post('transactions')
  createTransaction(@Body() data: any) {
    return this.adminService.createTransaction(data);
  }

  @Post('generic-data')
  createGenericEntry(@Body() data: any) {
    return this.adminService.createGenericEntry(data);
  }

  // ------------------------------------------- //

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  @Delete('lessons/:id')
  deleteLesson(@Param('id') id: number) {
    return this.adminService.deleteLesson(id);
  }

  @Delete('course-filter-options/:id')
  deleteCourseFilterOption(@Param('id') id: number) {
    return this.adminService.deleteCourseFilterOption(id);
  }

  @Delete('course-sections/:id')
  deleteCourseSection(@Param('id') id: number) {
    return this.adminService.deleteCourseSection(id);
  }

  @Delete('courses/:id')
  deleteCourse(@Param('id') id: number) {
    return this.adminService.deleteCourse(id);
  }

  @Delete('favourites/:id')
  deleteFavourite(@Param('id') id: number) {
    return this.adminService.deleteFavourite(id);
  }

  @Delete('previews/:id')
  deletePreview(@Param('id') id: number) {
    return this.adminService.deletePreview(id);
  }

  @Delete('lesson-files/:id')
  deleteLessonFile(@Param('id') id: number) {
    return this.adminService.deleteLessonFile(id);
  }

  @Delete('quiz-options/:id')
  deleteQuizOption(@Param('id') id: number) {
    return this.adminService.deleteQuizOption(id);
  }

  @Delete('quiz-options-categories/:id')
  deleteQuizOptionsCategory(@Param('id') id: number) {
    return this.adminService.deleteQuizOptionsCategory(id);
  }

  @Delete('quiz-replies/:id')
  deleteQuizReply(@Param('id') id: number) {
    return this.adminService.deleteQuizReply(id);
  }

  @Delete('subscription-plans/:id')
  deleteSubscriptionPlan(@Param('id') id: number) {
    return this.adminService.deleteSubscriptionPlan(id);
  }

  @Delete('transactions/:id')
  deleteTransaction(@Param('id') id: number) {
    return this.adminService.deleteTransaction(id);
  }

  @Delete('generic-data/:id')
  deleteGenericEntry(@Param('id') id: number) {
    return this.adminService.deleteGenericEntry(id);
  }

  @Delete('files/:slug?*')
  deleteFile(@Param() params: string[]) {
    return this.adminService.deleteFile(params);
  }

  // ------------------------------------------- //

  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Put('lessons/:id')
  updateLesson(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateLesson(id, data);
  }

  @Put('course-filter-options/:id')
  updateCourseFilterOption(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateCourseFilterOption(id, data);
  }

  @Put('course-sections/:id')
  updateCourseSection(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateCourseSection(id, data);
  }

  @Put('courses/:id')
  updateCourse(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateCourse(id, data);
  }

  @Put('favourites/:id')
  updateFavourite(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateFavourite(id, data);
  }

  @Put('previews/:id')
  updatePreview(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updatePreview(id, data);
  }

  @Put('lesson-files/:id')
  updateLessonFile(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateLessonFile(id, data);
  }

  @Put('quiz-options/:id')
  updateQuizOption(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateQuizOption(id, data);
  }

  @Put('quiz-options-categories/:id')
  updateQuizOptionsCategory(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateQuizOptionsCategory(id, data);
  }

  @Put('quiz-replies/:id')
  updateQuizReply(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateQuizReply(id, data);
  }

  @Put('subscription-plans/:id')
  updateSubscriptionPlan(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateSubscriptionPlan(id, data);
  }

  @Put('transactions/:id')
  updateTransaction(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateTransaction(id, data);
  }

  @Put('generic-data/:id')
  updateGenericEntry(@Param('id') id: number, @Body() data: any) {
    return this.adminService.updateGenericEntry(id, data);
  }

  // ------------------------------------------- //

  @Delete('users')
  deleteMultipleUsers(@Query() queries: any) {
    return this.adminService.deleteMultipleUsers(queries);
  }

  @Delete('lessons')
  deleteMultipleLessons(@Query() queries: any) {
    return this.adminService.deleteMultipleLessons(queries);
  }

  @Delete('course-filter-options')
  deleteMultipleCourseFilterOptions(@Query() queries: any) {
    return this.adminService.deleteMultipleCourseFilterOptions(queries);
  }

  @Delete('course-sections')
  deleteMultipleCourseSections(@Query() queries: any) {
    return this.adminService.deleteMultipleCourseSections(queries);
  }

  @Delete('courses')
  deleteMultipleCourses(@Query() queries: any) {
    return this.adminService.deleteMultipleCourses(queries);
  }

  @Delete('favourites')
  deleteMultipleFavourites(@Query() queries: any) {
    return this.adminService.deleteMultipleFavourites(queries);
  }

  @Delete('previews')
  deleteMultiplePreviews(@Query() queries: any) {
    return this.adminService.deleteMultiplePreviews(queries);
  }

  @Delete('lesson-files')
  deleteMultipleLessonFiles(@Query() queries: any) {
    return this.adminService.deleteMultipleLessonFiles(queries);
  }

  @Delete('quiz-options')
  deleteMultipleQuizOptions(@Query() queries: any) {
    return this.adminService.deleteMultipleQuizOptions(queries);
  }

  @Delete('quiz-options-categories')
  deleteMultipleQuizOptionsCategories(@Query() queries: any) {
    return this.adminService.deleteMultipleQuizOptionsCategories(queries);
  }

  @Delete('quiz-replies')
  deleteMultipleQuizReplies(@Query() queries: any) {
    return this.adminService.deleteMultipleQuizReplies(queries);
  }

  @Delete('subscription-plans')
  deleteMultipleSubscriptionPlans(@Query() queries: any) {
    return this.adminService.deleteMultipleSubscriptionPlans(queries);
  }

  @Delete('transactions')
  deleteMultipleTransactions(@Query() queries: any) {
    return this.adminService.deleteMultipleTransactions(queries);
  }

  @Delete('generic-data')
  deleteMultipleGenericEntries(@Query() queries: any) {
    return this.adminService.deleteMultipleGenericEntries(queries);
  }
}
