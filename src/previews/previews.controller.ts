import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreviewsService } from './previews.service';
import { CreatePreviewDto } from './dto/create-preview.dto';
import { UpdatePreviewDto } from './dto/update-preview.dto';

@Controller('previews')
export class PreviewsController {
  constructor(private readonly previewsService: PreviewsService) {}

  @Post()
  create(@Body() createPreviewDto: CreatePreviewDto) {
    return this.previewsService.create(createPreviewDto);
  }

  @Get()
  findAll() {
    return this.previewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.previewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreviewDto: UpdatePreviewDto) {
    return this.previewsService.update(+id, updatePreviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.previewsService.remove(+id);
  }
}
