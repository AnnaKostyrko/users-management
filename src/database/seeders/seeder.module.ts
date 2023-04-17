import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {TypeOrmConfigService} from "../../typeorm.service";
import {getEnvPath} from "../../env.helper";
import {Seeder} from "./seeder";
import {Logger, Module} from "@nestjs/common";
import {User} from "../../users/entities/user.entity";
import {Position} from "../../users/entities/position.entity";
import {Token} from "../../auth/entities/token.entity";
const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath, isGlobal: true }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        TypeOrmModule.forFeature([User, Position, Token])
    ],
    providers: [Logger, Seeder],
})
export class SeederModule {}