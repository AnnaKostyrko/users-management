import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {Position} from "./entities/position.entity";
import * as sharp from "sharp";
import tinify from "tinify";

tinify.key = "CXNWLpLVtcDBQy9pxC8dlKSxS7T3pCZP";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Position)
        private positionsRepository: Repository<Position>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {

        const position = await this.positionsRepository.findOneBy({
            id: +createUserDto.position_id,
        });
        if (!position) {
            throw new HttpException('Position not found', HttpStatus.BAD_REQUEST);
        }

        return this.usersRepository.save({
            name: createUserDto.name,
            email: createUserDto.email,
            phone: createUserDto.phone,
            position
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

        const totalUserCount = await this.usersRepository.count();

        const formattedUsersItems = users.map((user: User) => {
            const responseItem = {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                position_id: user.position.id.toString(),
                position: user.position.name,
                registration_timestamp: user.registration_timestamp.getTime(),
                photo: '/uploads/' + user.id + '.jpg'
            };

            return responseItem;
        });

        return {
            "success": true,
            "page": offset ? 1 : page,
            "total_pages": Math.floor(totalUserCount / count),
            "total_users": totalUserCount,
            "count": formattedUsersItems.length,
            "links": {
                "next_url": `http://localhost:3000/users?page=${page + 1}&count=${count}`,
                "prev_url": null
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

    async processImage(userId: number, file: Express.Multer.File) {
        const imagePath = `./uploads/${userId}.jpg`;

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
