import { CourseFilterOption } from '@/src/course-filter-options/entities/course-filter-option.entity';
import { CourseSection } from '@/src/course-sections/entities/course-section.entity';
import { Course } from '@/src/courses/entities/course.entity';
import { Favourite } from '@/src/favourites/entities/favourite.entity';
import { LessonFile } from '@/src/lesson-files/entities/lesson-file.entity';
import { Preview } from '@/src/previews/entities/preview.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';

@Table
export class Lesson extends Model<Lesson> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  video: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  duration: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  isPaid: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  views: number;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
  })
  timings: string;

  @BelongsTo(() => Course)
  course: Course;

  @ForeignKey(() => Course)
  courseId: number;

  @BelongsTo(() => CourseFilterOption)
  filter: CourseFilterOption;

  @ForeignKey(() => CourseFilterOption)
  filterId: number;

  @BelongsTo(() => CourseSection)
  section: CourseSection;

  @ForeignKey(() => CourseSection)
  sectionId: number;

  @HasMany(() => Favourite)
  favourites: Favourite;

  @HasOne(() => Preview)
  preview: Preview;

  @HasMany(() => LessonFile)
  files: LessonFile;
}
