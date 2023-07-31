import { User } from '@/src/users/entities/user.entity';
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
export class Transaction extends Model<Transaction> {
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ApiProperty()
  sum: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;
}
