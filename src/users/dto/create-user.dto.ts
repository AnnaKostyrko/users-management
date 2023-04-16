import {
    IsEmail,
    IsNotEmpty, IsNumberString,
    IsString,
    Matches, MaxLength, MinLength
} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: 'name field is required'})
    @IsString()
    @MinLength(2, {message: 'name must be at least 2 characters'})
    @MaxLength(60,  {message: 'name must be at most 60 characters'})
    readonly name: string;

    @IsString()
    @IsNotEmpty({message: 'email field is required'})
    @IsEmail({}, {message: 'email must be a valid email address'})
    readonly email: string;

    @IsString()
    @IsNotEmpty({message: 'phone field is required'})
    @Matches(/^\+380[0-9]{9}$/)
    readonly phone: string;

    @IsNotEmpty({message: 'position id field is required'})
    @IsNumberString({}, {message: 'position id must be an integer'})
    readonly position_id: string;
}
