import {Controller, Get, Post, Body, Param, Req, UseInterceptors, UploadedFile} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
