import {
    Controller,
    Get,
    Post,
    Body,
    Headers,
    Param,
    Req,
    UseInterceptors,
    UploadedFile,
    Query,
    Res
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthService} from "../auth/auth.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async create(
        @Headers('Token') token: string,
        @Body() createUserDto: CreateUserDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() response) {

        const tokenValidationError = await this.authService.checkToken(token);
        if (tokenValidationError) {
            return response.status(401).json({
                "success": false,
                "message": tokenValidationError
            })
        }

        const user = await this.usersService.create(createUserDto);
        await this.usersService.processImage(user.id, file);


        return {
            "success": true,
            "user_id": user.id,
            "message": "New user successfully registered"
        };
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
