import {
    Controller,
    Get,
    Post,
    Body,
    Headers,
    Param,
    UseInterceptors,
    UploadedFile,
    Query,
    Res, ValidationPipe, ParseIntPipe, ValidationError
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthService} from "../auth/auth.service";
import * as crypto from "crypto";
import {UnsuccessfulApiCallException} from "../exceptions/validation-exception";
import {GetUserListParamsDto} from "./dto/get-user-list-params.dto";
import {CreateUserFromValidator} from "./validators/create-user-from-validator";
import {formatFails} from "./validators/format-fails.helper";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly authService: AuthService,
                private readonly createUserFromValidator: CreateUserFromValidator
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    async create(
        @Headers('Token') token: string,
        @Body() createUserDto: CreateUserDto,
        @UploadedFile() file: Express.Multer.File,
        @Res() response) {

       // await this.authService.checkAndInvalidateToken(token);
        await this.createUserFromValidator.validate(createUserDto, file);

        const existingUsers = await this.usersService.findBy(createUserDto.phone, createUserDto.email);
        if (existingUsers.length) {
            throw new UnsuccessfulApiCallException(null, "User with this phone or email already exist", 409);
        }

        const imageName = crypto.randomBytes(10).toString('hex') + (file.mimetype === 'image/jpeg' ? '.jpeg' : '.jpg');
        await this.usersService.processImage(imageName, file);
        const user = await this.usersService.create(createUserDto, imageName);

        return response.json({
            "success": true,
            "user_id": user.id,
            "message": "New user successfully registered"
        });
    }

    @Get()
    async findAll(
        @Query(new ValidationPipe({
            transform: true,
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                return new UnsuccessfulApiCallException(formatFails(validationErrors), "Validation failed", 422)
            },
        })) queryParams: GetUserListParamsDto,
    ) {
        return this.usersService.findAll(queryParams.page, queryParams.count, queryParams.offset);
    }

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe({
        exceptionFactory: (errors) => {
            return new UnsuccessfulApiCallException({
                user_id: ["The user_id must be an integer."]
            }, "Validation failed", 400);
        }
    })) id: number) {

        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new UnsuccessfulApiCallException({
                user_id: ["User not found"]
            }, "The user with the requested identifier does not exist", 404);
        }

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                position_id: user.position.id,
                position: user.position.name,
                photo: '/uploads/' + user.photo
            }
        };
    }
}
