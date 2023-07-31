import { Lesson } from '@/src/lessons/entities/lesson.entity';
import { User } from '@/src/users/entities/user.entity';
import { BelongsTo, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table
export class Favourite extends Model<Favourite> {
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => Lesson)
  lesson: Lesson;

  @ForeignKey(() => Lesson)
  lessonId: number;
}
