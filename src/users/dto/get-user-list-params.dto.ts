import {IsNumber, Max, Min, ValidateIf} from "class-validator";

export class GetUserListParamsDto {

    @ValidateIf(o => o.offset === null)
    @IsNumber({}, {message: "page must be an integer"})
    @Min(1, {message: "page must be at least 1"})
    readonly page?: number;

    @IsNumber({}, {message: "count must be an integer"})
    @Min(1, {message: "count must be at least 1"})
    @Max(100, {message: "count must be at most 100"})
    readonly count?: number;

    @IsNumber({}, {message: "offset must be an integer"})
    @Min(0, {message: "offset must be at least 0"})
    readonly offset?: number | null;
}