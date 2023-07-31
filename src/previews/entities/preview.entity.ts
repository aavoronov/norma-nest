import { Course } from '@/src/courses/entities/course.entity';
import { Lesson } from '@/src/lessons/entities/lesson.entity';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

@Table
export class Preview extends Model<Preview> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  url: string;

  @BelongsTo(() => Lesson)
  lesson: Lesson;

  @ForeignKey(() => Lesson)
  lessonId: number;

  @BelongsTo(() => Course)
  course: Course;

  @ForeignKey(() => Course)
  courseId: number;
}
