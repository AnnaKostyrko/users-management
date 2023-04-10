import { Controller, Get } from "@nestjs/common";
import { PositionsService } from "./positions.service";

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    async findAll() {
        const position = await this.positionsService.findAll()
        if (position.length === 0) {
            return {
                "success": false,
                "message": "Positions not found"
            }
        }
        return {
            "success": true,
            positions: await this.positionsService.findAll()
        }
    }
}