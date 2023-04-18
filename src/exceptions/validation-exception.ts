import {HttpStatus} from "@nestjs/common";
import {HttpException} from "@nestjs/common/exceptions/http.exception";

export class UnsuccessfulApiCallException extends HttpException {
    constructor(fails: Object = null, message: string = "Validation failed", statusCode = HttpStatus.UNPROCESSABLE_ENTITY) {
        const response: any = {
            success: false,
            message: message,
        }
        if (fails) {
            response.fails = fails
        }

        super(response, statusCode);
    }
}