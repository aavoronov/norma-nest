import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { IEmailRegister } from '../mailer/interfaces/email.body';
import { MailerService } from '../mailer/mailer.service';
import { QuizReply } from '../quiz-replies/entities/quiz-reply.entity';
import { RestorationKey } from '../restoration-keys/entities/restoration-key.entity';
import { SubscriptionPlan } from '../subscription-plans/entities/subscription-plan.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { checkEmail } from '../utils/functions';
import { Verification } from '../verifications/entities/verification.entity';
import { CheckUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const mailerService = new MailerService();

@Injectable()
export class UsersService {
  length = 6;

  private static validPassword(password: string, userPassword: string) {
    return bcrypt.compareSync(password, userPassword);
  }

  private static getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  private checkPassword = (value: string) => {
    // if (
    //   !value.match(upperLetters) ||
    //   !value.match(upperCaseLetters) ||
    //   !value.match(numbers)
    // )
    //   return {
    //     status: false,
    //     message:
    //       'Пароль должен содержать заглавную букву, строчную букву и цифры.',
    //   };

    try {
      if (!(value.length >= this.length))
        return {
          status: false,
          message: `Минимальное количество символов пароля — ${this.length}.`,
        };
      return { status: true, message: '' };
    } catch (e) {
      console.log(e);
    }
  };

  async getUserByToken(token: string) {
    try {
      const result = await jwt.verify(token, process.env.JWT);

      // console.log(result);
      if (!!result.message) {
        throw new HttpException(
          'Сессия истекла или недействительна',
          StatusCodes.FORBIDDEN,
          {
            cause: new Error('Some Error'),
          },
        );
      }
      const user = await User.findOne({
        where: { email: result.email },
        include: [{ model: Verification }],
      });
      if (!user) {
        throw new HttpException(
          'Пользователь не существует',
          StatusCodes.UNAUTHORIZED,
          {
            cause: new Error('Some Error'),
          },
        );
      }
      return user;
    } catch (e) {
      throw new HttpException(e.message, StatusCodes.FORBIDDEN, {
        cause: new Error('Some Error'),
      });
    }
  }

  async canSignUp(user: CheckUserDto) {
    try {
      const { email, password } = user;
      if (!checkEmail(email).correct)
        throw new HttpException(
          'Вы некорректно ввели адрес электронной почты',
          StatusCodes.CONFLICT,
          {
            cause: new Error('Some Error'),
          },
        );

      if (!!(await User.findOne({ where: { email: email } }))) {
        throw new HttpException(
          'Пользователь с таким email уже существует',
          StatusCodes.CONFLICT,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      if (!this.checkPassword(password).status) {
        throw new HttpException(
          this.checkPassword(password).message,
          StatusCodes.BAD_REQUEST,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      return { status: StatusCodes.OK, text: 'success' };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async createOrUpdateVerificationAndSend(user: User) {
    const verification = await Verification.findOne({
      where: { userId: user.id },
    });
    let token: string;
    if (!verification) {
      ({ token } = await Verification.create({ userId: user.id }));
    } else {
      const newVerification = await verification.update({
        userId: user.id,
      });
      token = newVerification.token;
    }
    try {
      if (user.email) {
        const mailBody: IEmailRegister = {
          email: user.email,
          verification: token,
        };

        await mailerService.sendMailRegister(mailBody);
        return true;
      }
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async signUp(user: CreateUserDto) {
    try {
      const {
        name,
        email,
        password,
        promoAgreement,
        occupation,
        position,
        anticipations,
      } = user;

      const salt = bcrypt.genSaltSync();
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        password: passwordHash,
        promoAgreement,
        role: 'user',
      });

      if (newUser) {
        if (user.email) {
          await QuizReply.create({
            userId: newUser.id,
            occupation,
            position,
            anticipations,
          });
        }
        await this.createOrUpdateVerificationAndSend(newUser);
      }

      const signInRes = await this.signIn({
        email: newUser.email,
        password: password,
      });

      return signInRes;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async sendVerification(req) {
    try {
      const user = await this.getUserByToken(req.headers.authorization);
      await this.createOrUpdateVerificationAndSend(user);
      return { status: StatusCodes.OK, text: 'success' };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async signIn(userData: UserDto) {
    const { email, password } = userData;

    try {
      if (!email)
        throw new HttpException('Почта не введена', StatusCodes.BAD_REQUEST, {
          cause: new Error('Some Error'),
        });
      if (!password)
        throw new HttpException('Пароль не введен', StatusCodes.BAD_REQUEST, {
          cause: new Error('Some Error'),
        });

      if (!checkEmail(email).correct)
        throw new HttpException(
          'Вы некорректно ввели адрес электронной почты',
          StatusCodes.BAD_REQUEST,
          {
            cause: new Error('Some Error'),
          },
        );

      const user = await User.findOne({
        where: { email: email },
        // attributes: ['email', 'role', 'isDeleted', 'password', 'name', 'subscriptionThrough'],
        include: [{ model: Verification, attributes: ['token'] }],
      });

      let passwordMatches = false;

      if (user && user.isDeleted) {
        throw new HttpException('Аккаунт удален', StatusCodes.FORBIDDEN, {
          cause: new Error('Some Error'),
        });
      }

      if (user)
        passwordMatches = UsersService.validPassword(password, user.password);

      if (!user || !passwordMatches) {
        throw new HttpException(
          'Неправильный логин или пароль',
          StatusCodes.NOT_FOUND,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      // if (user.role === 'admin') {
      //   throw new HttpException(
      //     'Нет доступа к публичной части',
      //     StatusCodes.FORBIDDEN,
      //     {
      //       cause: new Error('Some Error'),
      //     },
      //   );
      // }

      let accessToken: string;

      try {
        accessToken = jwt.sign(user.toJSON(), process.env.JWT, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      } catch (e) {
        console.log(e);
      }

      return {
        status: StatusCodes.OK,
        message: ReasonPhrases.OK,
        token: accessToken,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionThrough: user.subscriptionThrough,
          subscriptionCancelled: user.subscriptionCancelled,
          emailConfirmed: !user.verification,
        },
      };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async reauthorize(req) {
    try {
      const result = await this.getUserByToken(req.headers.authorization);
      // return { email: result.email, phone: result.phone, role: result.role };

      return {
        name: result.name,
        email: result.email,
        role: result.role,
        subscriptionThrough: result.subscriptionThrough,
        subscriptionCancelled: result.subscriptionCancelled,
        emailConfirmed: !result.verification?.token,
      };
    } catch (e) {
      throw new HttpException(e.message, StatusCodes.FORBIDDEN, {
        cause: new Error('Some Error'),
      });
    }
  }

  async updateUser(req, userData: UpdateUserDto) {
    const user = await this.getUserByToken(req.headers.authorization);
    console.log('userData', userData);
    user.update(userData);

    return { status: StatusCodes.OK, text: 'success' };
  }

  async verify(verification: string) {
    try {
      const user = await Verification.findOne({
        where: { token: verification },
        // include: { model: User, attributes: ['id', 'email'] },
      });

      if (!user) {
        throw new HttpException(
          'Аккаунт уже подтвержден или не существует, либо ссылка устарела.',
          StatusCodes.NOT_ACCEPTABLE,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      {
        await Verification.destroy({ where: { userId: user.userId } });
        // console.log(user.id);
        // return {
        //   status: StatusCodes.OK,
        //   message: ReasonPhrases.OK,
        // };
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Норма - подтверждение аккаунта</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">

        </head>
        <body>
        <div style="width: 100%; display: flex; align-items: center; margin-top: 10%; flex-direction: column"><span style="font-family: Roboto; text-align: center">Подтверждение почты прошло успешно. Вы можете закрыть эту страницу.</span>
        </div>
        </body>
        </html>`;
      }
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async deleteAccount(req) {
    try {
      const user = await this.getUserByToken(req.headers.authorization);
      user.update({ isDeleted: true });
      return { status: StatusCodes.NO_CONTENT };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async subscribe(req, data: { id: number }) {
    try {
      const { id } = data;
      const selectedPlan = await SubscriptionPlan.findOne({
        where: { id: id },
      });
      const user = await this.getUserByToken(req.headers.authorization);

      const days = selectedPlan.term;
      const date = !user.subscriptionThrough
        ? new Date()
        : user.subscriptionThrough;
      date.setDate(date.getDate() + days);

      // user.update({
      //   subscriptionThrough: date,
      //   subscriptionCancelled: false,
      // });

      // user.subscriptionThrough = date;
      // user.subscriptionCancelled = false;

      await User.update(
        { subscriptionThrough: date, subscriptionCancelled: false },
        { where: { id: user.id } },
      );

      console.log('user.subscriptionThrough', user.subscriptionThrough);
      await Transaction.create({ userId: user.id, sum: selectedPlan.price });

      return {
        status: StatusCodes.CREATED,
        text: 'ok',
        date: user.subscriptionThrough,
      };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async sendPasswordRestorationMail(data: { email: string }) {
    try {
      const user = await User.findOne({ where: { email: data.email } });
      if (!user) {
        throw new HttpException(
          'Аккаунт с этой почтой не зарегистрирован',
          StatusCodes.NOT_FOUND,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      const restoration = await RestorationKey.findOne({
        where: { userId: user.id },
      });
      let token: string;
      if (!restoration) {
        ({ token } = await RestorationKey.create({ userId: user.id }));
      } else {
        const newRestoration = await restoration.update({
          userId: user.id,
        });
        token = newRestoration.token;
      }

      await mailerService.restorePasswordMail({
        email: data.email,
        token: token,
      });

      return { status: StatusCodes.CREATED, text: 'ok' };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async restorationPrompt(restoration: string) {
    try {
      const user = await RestorationKey.findOne({
        where: { token: restoration },
      });

      if (!user) {
        throw new HttpException(
          'Аккаунт не существует, либо ссылка устарела.',
          StatusCodes.NOT_ACCEPTABLE,
          {
            cause: new Error('Some Error'),
          },
        );
      }
      // console.log(user.id);
      // return {
      //   status: StatusCodes.OK,
      //   message: ReasonPhrases.OK,
      // };
      return `
      <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Норма - восстановление пароля</title>
    <link href="https://fonts.cdnfonts.com/css/sf-pro-display" rel="stylesheet" />
  </head>
  <body>
    <div class="container">
      <span class="heading">Установите новый пароль учетной записи. Старый пароль будет сброшен.</span>
      <input type="password" id="p1" placeholder="Введите пароль" />
      <input type="password" id="p2" placeholder="Повторите пароль" />
      <button onclick="handlePress()">Установить пароль</button>
    </div>
    <style>
      .container {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 10%;
        flex-direction: column;
        box-sizing: border-box;
      }

      .container * {
        box-sizing: border-box;
        font-family: "SF Pro Display";
      }

      .heading {
        font-weight: 300;
        text-align: center;
        margin-bottom: 20px;
      }

      input {
        border-radius: 8px;
        border: 1px solid #a8a8b1;
        width: 300px;
        outline: none;
        transition: all 0.5s;
        padding: 10px;
        margin-bottom: 20px;
      }

      input:focus {
        border: 1px solid #5d5d69;
      }

      button {
        border-radius: 8px;
        border-width: 0;
        height: 40px;
        background-color: #e31f25;
        width: 300px;
        transition: 0.5s;
        padding: 10px;
        color: #fff;
        cursor: pointer;
        transition: all 0.5s;
      }

      button:hover {
        background-color: #ff0000;
      }
    </style>
    <script>
      const fields = document.querySelectorAll("input");
      Array.from(fields).map((item) =>
        item.addEventListener("keyup", function (event) {
          var userName = item.value;
          userName = userName.replace(/\s/g, "");
          item.value = userName;
        })
      );

      function passwordsValid() {
        const values = Array.from(fields).map((item) => item.value);
        if (values[0].length < 6 || values[1].length < 6) {
          throw new Error("Пароль должен содержать минимум 6 символов");
        }

        if (values[0] !== values[1]) {
          throw new Error("Пароли не совпадают");
        }
        return values[0];
      }

      async function handlePress() {
        try {
          const password = passwordsValid();
          const res = fetch("${process.env.API_URL}users/restore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
              restoration: "${restoration}",
              password: password,
            }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.status === 200) {
                alert("Пароль успешно установлен. Вы можете закрыть эту страницу.");
              } else {
                alert(json.message);
              }
            });
        } catch (e) {
          alert(e.message || e.response.data.message);
        }
      }
    </script>
  </body>
</html>
      `;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async restore(data: { restoration: string; password: string }) {
    try {
      const user = await User.findOne({
        attributes: ['id', 'email'],
        include: { model: RestorationKey, where: { token: data.restoration } },
      });

      if (!user) {
        throw new HttpException(
          'Аккаунт не существует, либо ссылка устарела.',
          StatusCodes.NOT_ACCEPTABLE,
          {
            cause: new Error('Some Error'),
          },
        );
      }

      const salt = bcrypt.genSaltSync();
      const passwordHash = await bcrypt.hash(data.password, salt);
      user.update({ password: passwordHash });

      await RestorationKey.destroy({ where: { userId: user.id } });

      return { status: StatusCodes.OK, text: 'ok' };
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
