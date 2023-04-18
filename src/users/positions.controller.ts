import {Controller, Get } from "@nestjs/common";
import { PositionsService } from "./positions.service";
import {UnsuccessfulApiCallException} from "../exceptions/validation-exception";

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    async findAll() {
        const position = await this.positionsService.findAll()
        if (!position.length) {
            throw new UnsuccessfulApiCallException(null, "Positions not found");
        }
        return {
            "success": true,
            positions: await this.positionsService.findAll()
        }
    }
}
