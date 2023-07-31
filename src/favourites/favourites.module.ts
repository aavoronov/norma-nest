import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService],
  imports: [UsersModule],
})
export class FavouritesModule {}
