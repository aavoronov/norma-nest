import * as bcrypt from 'bcrypt';
import {
  BeforeCreate,
  BeforeUpdate,
  BeforeUpsert,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table
export class Verification extends Model<Verification> {
  @Column
  token: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;

  @BeforeCreate
  @BeforeUpdate
  @BeforeUpsert
  static hashToken(instance: Verification) {
    const salt = bcrypt.genSaltSync();
    instance.token = bcrypt.hashSync(
      JSON.stringify({ date: new Date(), id: instance.id }),
      salt,
    );
  }
}
