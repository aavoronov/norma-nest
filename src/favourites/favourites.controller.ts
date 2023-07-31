import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FavouritesService } from './favourites.service';

@ApiTags('favourites')
@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Post()
  toggleFave(@Req() req, @Body() body: { id: string }) {
    console.log('body.id', body.id);
    return this.favouritesService.toggleFave(req, +body.id);
  }

  @Get()
  getMyFaves(@Req() req) {
    return this.favouritesService.getMyFaves(req);
  }
}
