import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import {getEnvPath} from "./env.helper";
import {ConfigModule} from "@nestjs/config";
import { TypeOrmConfigService } from './typeorm.service';

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
      UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
