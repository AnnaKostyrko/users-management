import { Controller, Get, Param } from "@nestjs/common";
import {PositionsService} from "./positions.service";

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    findAll() {
        return this.positionsService.findAll();
    }
}