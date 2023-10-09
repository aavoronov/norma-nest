import { CourseFilterOption } from '@/src/course-filter-options/entities/course-filter-option.entity';
import { CourseSection } from '@/src/course-sections/entities/course-section.entity';
import { Lesson } from '@/src/lessons/entities/lesson.entity';
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
export class Course extends Model<Course> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  title: string;

  @Column({
    type: DataType.STRING(10000),
    allowNull: false,
  })
  @ApiProperty()
  description: string;

  @BelongsTo(() => CourseSection)
  section: CourseSection;

  @ForeignKey(() => CourseSection)
  sectionId: number;

  @BelongsTo(() => CourseFilterOption)
  filter: CourseFilterOption;

  @ForeignKey(() => CourseFilterOption)
  filterId: number;

  @HasMany(() => Lesson)
  lessons: Lesson;

  @HasOne(() => Preview)
  preview: Preview;
}
