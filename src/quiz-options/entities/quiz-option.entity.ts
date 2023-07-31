import { QuizOptionsCategory } from '@/src/quiz-options-categories/entities/quiz-options-category.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

@Table
export class QuizOption extends Model<QuizOption> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  option: string;

  @BelongsTo(() => QuizOptionsCategory)
  category: QuizOptionsCategory;

  @ForeignKey(() => QuizOptionsCategory)
  categoryId: number;
}
