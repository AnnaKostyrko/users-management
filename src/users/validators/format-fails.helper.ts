import {ValidationError} from "@nestjs/common";

export const formatFails = (validationErrors: ValidationError[] = []) => {
    const fails = {};
    for (let error of validationErrors) {
        fails[error.property] = [];
        for (let constraint in error.constraints) {
            fails[error.property].push('The ' + error.constraints[constraint] + '.')
        }
    }

    return fails;
}