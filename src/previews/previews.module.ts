import { Module } from '@nestjs/common';
import { PreviewsService } from './previews.service';
import { PreviewsController } from './previews.controller';

@Module({
  controllers: [PreviewsController],
  providers: [PreviewsService],
})
export class PreviewsModule {}
