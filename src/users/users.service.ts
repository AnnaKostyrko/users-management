import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {Position} from "./entities/position.entity";
import * as sharp from "sharp";
import tinify from "tinify";
import {ConfigService} from "@nestjs/config";
import {UnsuccessfulApiCallException} from "../exceptions/validation-exception";

@Injectable()
export class UsersService {
    constructor(
        @Inject(ConfigService)
        private readonly config: ConfigService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Position)
        private positionsRepository: Repository<Position>,
    ) {
        tinify.key = this.config.get<string>('TINIFY_KEY');
    }

    async create(createUserDto: CreateUserDto, imageName: string): Promise<User> {
        const position = await this.positionsRepository.findOneBy({
            id: +createUserDto.position_id,
        });
        if (!position) {
            throw new UnsuccessfulApiCallException(
                null,
                `Position with id [${createUserDto.position_id}] does not exist`,
                409);
        }

        return this.usersRepository.save({
            name: createUserDto.name,
            email: createUserDto.email,
            phone: createUserDto.phone,
            position,
            photo: imageName
        });
    }

    async findAll(
        page: number, count: number, offset: number
    ) {
        const skip = offset ? offset : (page - 1) * count;

        const users = await this.usersRepository.find({
            order: {registration_timestamp: 'desc'},
            relations: {
                position: true,
            },
            skip: skip,
            take: count
        });

        const formattedUsersItems = users.map((user: User) => {
            const responseItem = {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                position_id: user.position.id.toString(),
                position: user.position.name,
                registration_timestamp: user.registration_timestamp.getTime(),
                photo: '/uploads/' + user.photo
            };

            return responseItem;
        });

        const totalUserCount = await this.usersRepository.count();
        const totalPages = Math.ceil(totalUserCount / count);

        let nextUrl = null
        let prevUrl = null

        if (users.length && !offset) {
            if (page > 1) {
                prevUrl = `http://localhost:3000/users?page=${page - 1}&count=${count}`
            }
            if (page !== totalPages) {
                nextUrl = `http://localhost:3000/users?page=${page + 1}&count=${count}`
            }
        }

        return {
            "success": true,
            "page": offset ? null : page,
            "total_pages": totalPages,
            "total_users": totalUserCount,
            "count": formattedUsersItems.length,
            "links": {
                "next_url": nextUrl,
                "prev_url": prevUrl
            },
            users: formattedUsersItems,
        };
    }

    async findOne(id: number): Promise<User> {
        return this.usersRepository.findOne({
            where: {id}, relations: {
                position: true,
            }
        });
    }

    async findBy(phone: string, email: string) {
        return this.usersRepository.findBy(
            [
                { phone },
                { email }
            ]
        )
    }

    async getImageMetadata(file: Express.Multer.File) {
        return sharp(file.buffer).metadata()
    }

    async processImage(imageName: string, file: Express.Multer.File) {
        const imagePath = './uploads/' + imageName;


        const metadata = await sharp(file.buffer).metadata()

        const imageBuffer = await sharp(file.buffer)
            .extract({
                width: 70,
                height: 70,
                left: Math.floor(metadata.width / 2 - 35),
                top: Math.floor(metadata.height / 2 - 35)
            })
            .jpeg({mozjpeg: true})
            .toBuffer()

        const source = tinify.fromBuffer(imageBuffer);
        await source.toFile(imagePath);
    }
}
