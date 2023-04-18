import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import {getEnvPath} from "./env.helper";
import {ConfigModule} from "@nestjs/config";
import { TypeOrmConfigService } from './typeorm.service';
import { AuthModule } from './auth/auth.module';

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
      UsersModule,
      AuthModule],
  controllers: [AppController],
})
export class AppModule {}
