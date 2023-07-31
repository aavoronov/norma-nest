import { Favourite } from '@/src/favourites/entities/favourite.entity';
import { QuizReply } from '@/src/quiz-replies/entities/quiz-reply.entity';
import { RestorationKey } from '@/src/restoration-keys/entities/restoration-key.entity';
import { Transaction } from '@/src/transactions/entities/transaction.entity';
import { Verification } from '@/src/verifications/entities/verification.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  @ApiProperty()
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  role: 'user' | 'admin';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  @ApiProperty()
  isDeleted: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  subscriptionThrough: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  @ApiProperty()
  subscriptionCancelled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  promoAgreement: boolean;

  @HasOne(() => QuizReply)
  quizReply: QuizReply;

  @HasOne(() => Verification)
  verification: Verification;

  @HasOne(() => RestorationKey)
  restoration: RestorationKey;

  @HasMany(() => Transaction)
  transactions: Transaction;

  @HasMany(() => Favourite)
  favourites: Favourite;
}
