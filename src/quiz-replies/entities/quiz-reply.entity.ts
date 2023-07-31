import { User } from '@/src/users/entities/user.entity';
import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

@Table
export class QuizReply extends Model<QuizReply> {
  @Column({
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  })
  occupation: string[];

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  position: string;

  @Column({
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  })
  anticipations: string[];

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
