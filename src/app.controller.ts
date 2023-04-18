import {Controller, Get, NotFoundException, Param, Res} from '@nestjs/common';
import * as fs from "fs";
const { pipeline } = require('node:stream/promises');

@Controller()
export class AppController {
  @Get('/images/users/:imageName')
  async getFile(@Param('imageName') fileName: string, @Res() response) {
    try {
      await pipeline(
          fs.createReadStream('./uploads/users/' + fileName),
          response
      )
    } catch (e) {
      throw new NotFoundException('Image not found.');
    }
  }
}
