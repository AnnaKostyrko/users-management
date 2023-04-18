import {CreateUserDto} from "../dto/create-user.dto";
import {UnsuccessfulApiCallException} from "../../exceptions/validation-exception";
import {Inject, Injectable} from "@nestjs/common";
import {UsersService} from "../users.service";
import {validate} from "class-validator";
import {formatFails} from "./format-fails.helper";

@Injectable()
export class CreateUserFromValidator {
    constructor(
        @Inject(UsersService)
        private readonly usersService: UsersService) {
    }
    public async validate(createUserDto: CreateUserDto, file: Express.Multer.File) {
        let fileErrors = [];
        if (!file) {
            fileErrors.push("The photo field is required.")
        } else {
            if (file.size > 5242880) {
                fileErrors.push("The photo may not be greater than 5 Mbytes.")
            }

            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
                fileErrors.push("Image is invalid.")
            } else {
                const metadata = await this.usersService.getImageMetadata(file);
                if (metadata.width < 70 || metadata.height < 70) {
                    fileErrors.push("The photo resolution may be at least 70x70px.")
                }
            }
        }
        const errors = await validate(Object.assign(new CreateUserDto(), createUserDto));
        if (errors.length || fileErrors.length) {
            let fails = formatFails(errors);
            if (fileErrors.length) {
                fails['photo'] = fileErrors;
            }

            throw new UnsuccessfulApiCallException(fails, "Validation failed", 422);
        }
    }
}