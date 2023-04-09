import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Position} from "./entities/position.entity";
import {PositionsController} from "./positions.controller";
import {PositionsService} from "./positions.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Position])],
  controllers: [UsersController, PositionsController],
  providers: [UsersService, PositionsService]
})
export class UsersModule {}
