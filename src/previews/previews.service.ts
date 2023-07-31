import { Injectable } from '@nestjs/common';
import { CreatePreviewDto } from './dto/create-preview.dto';
import { UpdatePreviewDto } from './dto/update-preview.dto';

@Injectable()
export class PreviewsService {
  create(createPreviewDto: CreatePreviewDto) {
    return 'This action adds a new preview';
  }

  findAll() {
    return `This action returns all previews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} preview`;
  }

  update(id: number, updatePreviewDto: UpdatePreviewDto) {
    return `This action updates a #${id} preview`;
  }

  remove(id: number) {
    return `This action removes a #${id} preview`;
  }
}
