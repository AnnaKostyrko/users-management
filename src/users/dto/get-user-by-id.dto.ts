import { IsNumber } from "class-validator";

export class GetUserByIdDto {

    @IsNumber({}, {message: "user_id must be an integer"})
    readonly id: number;

    constructor(id: number) {
        this.id = id;
    }
}