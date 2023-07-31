import { Course } from '@/src/courses/entities/course.entity';
import { Lesson } from '@/src/lessons/entities/lesson.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table
export class CourseSection extends Model<CourseSection> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  section: string;

  @HasMany(() => Course)
  courses: Course;

  @HasMany(() => Lesson)
  lessons: Lesson;
}
