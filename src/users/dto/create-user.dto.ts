import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 60)
    readonly name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+380[0-9]{9}$/)
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly position_id: string;
}
