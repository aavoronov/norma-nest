import {
  HttpException,
  Injectable,
  NestMiddleware,
  Next,
  Req,
  Res,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  // constructor(@InjectModel(User) private userModel: typeof User) {}
  async use(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const { authorization } = req.headers;
    console.log('test');
    console.log('authorization', authorization);
    try {
      if (!authorization) {
        // req.body = { ...req.body, access: false };
        throw new HttpException(
          'Нет доступа к ресурсу',
          StatusCodes.UNAUTHORIZED,
        );
        // return next();
      }
      const result = jwt.verify(authorization, process.env.JWT);

      console.log(result);
      if (!!result.message) {
        throw new HttpException(
          'Сессия истекла или недействительна',
          StatusCodes.FORBIDDEN,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      // console.log(user);

      const user = await User.findOne({
        where: { email: result.email },
      });

      if (!user) {
        // if (!user || !user.verification) {
        req.body = { ...req.body, access: false };

        return next();
      }

      if (user.isDeleted) {
        throw new HttpException('Аккаунт удален', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      req.body = {
        ...req.body,
        access: true,
        role: user.role,
        userId: user.id,
        // user: user.toJSON(),
      };

      return next();
    } catch (e) {
      // req.body = { ...req.body, access: false };
      throw new HttpException(
        'Нет доступа к ресурсу',
        StatusCodes.UNAUTHORIZED,
      );
      return next();
    }
  }
}
