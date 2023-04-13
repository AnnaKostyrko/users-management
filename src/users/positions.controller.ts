import { Controller, Get } from "@nestjs/common";
import { PositionsService } from "./positions.service";
import {response} from "express";

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Get()
    async findAll() {
        const position = await this.positionsService.findAll()
        if (position.length === 0) {
            return response.status(422).json({
                "success": false,
                "message": "Positions not found"
            })
        }
        return {
            "success": true,
            positions: await this.positionsService.findAll()
        }
    }
}