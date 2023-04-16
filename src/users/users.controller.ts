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
    Res, ValidationPipe, BadRequestException, HttpStatus
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthService} from "../auth/auth.service";
import {validateObject} from "./validation.helper";
import * as crypto from "crypto";
import {GetUserByIdDto} from "./dto/get-user-by-id.dto";

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

        let fileErrors = [];
        if (!file) {
            fileErrors.push("The photo field is required.")
        } else {
            if (file.size > 5242880) {
                fileErrors.push("The photo may not be greater than 5 Mbytes.")
            }

            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
                fileErrors.push("Image is invalid.")
            } else {
                const metadata = await this.usersService.getImageMetadata(file);
                if (metadata.width < 70 || metadata.height < 70) {
                    fileErrors.push("The photo resolution may be at least 70x70px.")
                }
            }
        }

        const createUserDtoFails = await validateObject(Object.assign(new CreateUserDto(), createUserDto))
        if (createUserDtoFails || fileErrors.length) {
            let fails = createUserDtoFails || {};
            if (fileErrors.length) {
                fails['photo'] = fileErrors;
            }

            return response.status(422).json({
                "success": false,
                "message": "Validation failed",
                fails
            })
        }

        const existingUsers = await this.usersService.findBy(createUserDto.phone, createUserDto.email);
        if (existingUsers.length) {
            return response.status(409).json({
                "success": false,
                "message": "User with this phone or email already exist"
            })
        }

        const imageName = crypto.randomBytes(10).toString('hex') + (file.mimetype === 'image/jpeg' ? '.jpeg' : '.jpg');
        await this.usersService.processImage(imageName, file);
        const user = await this.usersService.create(createUserDto, imageName);

        return response.status(200).json({
            "success": true,
            "user_id": user.id,
            "message": "New user successfully registered"
        });
    }

    @Get()
    async findAll(
        @Query('page') page: number,
        @Query('count') count: number,
        @Query('offset') offset: number,
        @Res() response
    ) {
        const userList = await this.usersService.findAll(+page, +count, +offset);
        return response.json(userList)
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response) {

        const getUserByIdDto = new GetUserByIdDto(+id);
        const getUserByIdDtoFails = await validateObject(getUserByIdDto)

        if (getUserByIdDtoFails) {
            return response.status(400).json({
                "success": false,
                "message": "Validation failed",
                "user_id": getUserByIdDtoFails
            })
        }

        const user = await this.usersService.findOne(+id);

        if (!user) {
            return response.status(404).json({
                "success": false,
                "message": "The user with the requested identifier does not exist",
                "fails": {
                    "user_id" : [
                        "User not found"
                    ]
                }
            });
        }

        return response.json ({
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
        });
    }
}
