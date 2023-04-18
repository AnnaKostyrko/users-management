import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Position} from "./entities/position.entity";
import {PositionsController} from "./positions.controller";
import {PositionsService} from "./positions.service";
import {Token} from "../auth/entities/token.entity";
import {AuthService} from "../auth/auth.service";
import {CreateUserFromValidator} from "./validators/create-user-from-validator";

@Module({
  imports: [TypeOrmModule.forFeature([User, Position, Token])],
  controllers: [UsersController, PositionsController],
  providers: [UsersService, PositionsService, AuthService, CreateUserFromValidator]
})
export class UsersModule {}
