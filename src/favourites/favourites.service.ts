import { HttpException, Injectable } from '@nestjs/common';
import { Lesson } from '../lessons/entities/lesson.entity';
import { UsersService } from '../users/users.service';
import { Favourite } from './entities/favourite.entity';
import { Preview } from '../previews/entities/preview.entity';

@Injectable()
export class FavouritesService {
  constructor(private readonly usersService: UsersService) {}

  async getMyFaves(req) {
    try {
      const user = await this.usersService.getUserByToken(
        req.headers.authorization,
      );
      const favourites = await Favourite.findAll({
        where: { userId: user.id },
        attributes: [],
        include: [
          {
            model: Lesson,
            attributes: ['id', 'title', 'duration', 'isPaid'],
            include: [{ model: Preview, attributes: ['url'] }],
          },
        ],
      });
      return favourites;
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }

  async toggleFave(req, id: number) {
    try {
      const user = await this.usersService.getUserByToken(
        req.headers.authorization,
      );

      const existingFave = await Favourite.findOne({
        where: { userId: user.id, lessonId: id },
      });

      console.log('id', id);

      if (!!existingFave) {
        await existingFave.destroy();
      } else {
        const favourite = await Favourite.create({
          userId: user.id,
          lessonId: id,
        });
      }

      return await this.getMyFaves(req);
    } catch (e) {
      throw new HttpException(e.message, e.status, {
        cause: new Error('Some Error'),
      });
    }
  }
}
