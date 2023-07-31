import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  password: string;

  @ApiProperty({ required: false })
  subscriptionThrough: Date;

  @ApiProperty({ required: false })
  subscriptionCancelled: boolean;

  @ApiProperty({ required: false })
  emailConfirmed: boolean;
}
