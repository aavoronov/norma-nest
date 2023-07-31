import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getFile(path: string, image: string, res: any): any {
    return res.sendFile(image, { root: `./uploads/${path}` });
  }
}
