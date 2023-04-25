import {IsNumber, IsOptional, Max, Min, ValidateIf} from "class-validator";
import {Type} from "class-transformer";

export class GetUserListParamsDto {

    @ValidateIf(o => o.offset == null)
    @Type(() => Number)
    @IsNumber({}, {message: "page must be an integer"})
    @Min(1, {message: "page must be at least 1"})
    readonly page?: number;

    @Type(() => Number)
    @IsNumber({}, {message: "count must be an integer"})
    @Min(1, {message: "count must be at least 1"})
    @Max(100, {message: "count must be at most 100"})
    readonly count: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, {message: "offset must be an integer"})
    @Min(0, {message: "offset must be at least 0"})
    readonly offset?: number;
}