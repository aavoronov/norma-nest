import { ApiProperty } from '@nestjs/swagger';

export class CheckUserDto {
  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly password: string;
}

export class CreateUserDto {
  @ApiProperty({ required: true })
  readonly name: string;

  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly password: string;

  @ApiProperty({ required: true })
  readonly promoAgreement: boolean;

  @ApiProperty({ required: true })
  readonly occupation: string[];

  @ApiProperty({ required: true })
  readonly position: string;

  @ApiProperty({ required: true })
  readonly anticipations: string[];
}
