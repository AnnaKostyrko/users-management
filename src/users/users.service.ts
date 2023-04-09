import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {Position} from "./entities/position.entity";

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      @InjectRepository(Position)
      private positionsRepository: Repository<Position>,
  ) {}

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

  async findAll() {

    const users = await this.usersRepository.find({
      order: { registration_timestamp: 'desc' },
      relations: {
        position: true,
      },
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
      };

      return responseItem;
    });

    return {
      users: formattedUsersItems,
    };
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
}
