import { Controller } from '@nestjs/common';
import { PreviewsService } from './previews.service';

@Controller('previews')
export class PreviewsController {
  constructor(private readonly previewsService: PreviewsService) {}
}
