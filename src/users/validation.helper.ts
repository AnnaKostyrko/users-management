import {validate} from "class-validator";

export async function validateObject (dto: any) {
    const errors = await validate(dto);
    if (errors.length) {
        const fails = {};
        for (let error of errors) {
            fails[error.property] = [];
            for (let constraint in error.constraints) {
                fails[error.property].push('The ' + error.constraints[constraint] + '.')
            }
        }

        return fails;
    }
    return null;
}
