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
export class LessonFile extends Model<LessonFile> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order: number;

  @BelongsTo(() => Lesson)
  lesson: Lesson;

  @ForeignKey(() => Lesson)
  lessonId: number;
}
