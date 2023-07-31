import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class SubscriptionPlan extends Model<SubscriptionPlan> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  term: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  humanFriendlyTerm: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  price: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  isPopular: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  isGoodOffer: boolean;
}
