import {Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../users/entities/user.entity";
import {Repository} from "typeorm";
import { faker } from '@faker-js/faker';
import {Position} from "../../users/entities/position.entity";

@Injectable()
export class Seeder {
    constructor(
        private readonly logger: Logger,

        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Position)
        private positionsRepository: Repository<Position>,

    ) {}
    async seed() {

        let positions = [];
        for (let i=0; i<=10; i++) {
            const position = new Position();
            position.name = faker.name.jobTitle();
            positions.push(position);
        }

        const savedPosition = await this.positionsRepository.save(positions);

        let users = [];
        for (let i=0; i<45; i++) {
            const user = new User();

            user.name = faker.name.firstName();
            user.email = faker.internet.email();
            user.phone = faker.phone.number('+380 ## ### ## ##')
            user.photo = faker.image.imageUrl(70, 70, 'Avatar', true)

            const positionIndex = Math.floor(Math.random() * savedPosition.length);
            user.position = savedPosition[positionIndex];

            users.push(user);
        }

        await this.usersRepository.save(users);
    }
}