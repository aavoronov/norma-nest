import { QuizOption } from '@/src/quiz-options/entities/quiz-option.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

@Table
export class QuizOptionsCategory extends Model<QuizOptionsCategory> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  subtitle: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  isMultipleChoice: boolean;

  @HasMany(() => QuizOption)
  options: QuizOption;
}
