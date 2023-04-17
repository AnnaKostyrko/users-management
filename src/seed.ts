import {SeederModule} from "./database/seeders/seeder.module";
import {NestFactory} from "@nestjs/core";
import {Logger} from "@nestjs/common";
import {Seeder} from "./database/seeders/seeder";

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const logger = appContext.get(Logger);
    const seeder = appContext.get(Seeder);
    try {
        await  seeder.seed()
        logger.log('Seeding complete!');
    } catch(error) {
        logger.error('Seeding failed!');
        throw error;
    }
    appContext.close()
}
bootstrap().catch(console.error)