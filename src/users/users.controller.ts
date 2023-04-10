import {Controller, Get, Post, Body, Param, Req, UseInterceptors, UploadedFile, Query} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(
        @Query('page') page: number,
        @Query('count') count: number,
        @Query('offset') offset: number,
    ) {
        return this.usersService.findAll(page, count, offset);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(+id);
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                position_id: user.position.id,
                position: user.position.name,
            }
        };
    }
}
