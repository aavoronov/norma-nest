import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('check')
  canSignUp(@Body() checkUserDto: CheckUserDto) {
    return this.usersService.canSignUp(checkUserDto);
  }

  @Post()
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  @Post('auth')
  signIn(@Body() userData: UserDto) {
    return this.usersService.signIn(userData);
  }

  @Get('reauth')
  reauthorize(@Req() req) {
    return this.usersService.reauthorize(req);
  }

  // responsible for the following actions:
  //
  // change name
  // subscribe
  // cancel subscription
  // confirm email
  // password change
  //
  // and potentially more
  // pretty much any data user model possesses in any combination
  @Patch('edit')
  updateUser(@Req() req, @Body() userData: UpdateUserDto) {
    return this.usersService.updateUser(req, userData);
  }

  @Get('send-verification')
  sendVerification(@Req() req) {
    return this.usersService.sendVerification(req);
  }

  @Get('verify')
  verify(@Query('key') verification: string) {
    return this.usersService.verify(verification);
  }

  @Post('post3ds')
  post3ds(@Body() data: { MD: string; PaRes: string }) {
    return this.usersService.post3ds(data);
  }

  @Post('subscribe')
  subscribe(@Req() req, @Body() data: { id: number }) {
    return this.usersService.subscribe(req, data);
  }

  @Delete()
  deleteAccount(@Req() req) {
    return this.usersService.deleteAccount(req);
  }

  @Post('request-restoration')
  sendPasswordRestorationMail(@Body() data: { email: string }) {
    return this.usersService.sendPasswordRestorationMail(data);
  }

  @Get('restore')
  restorationPrompt(@Query('key') restoration: string) {
    return this.usersService.restorationPrompt(restoration);
  }

  @Post('restore')
  restore(@Body() data: { restoration: string; password: string }) {
    return this.usersService.restore(data);
  }
}
