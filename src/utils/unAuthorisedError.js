import AppError from "./appError";
class UnAuthorisedError extends AppError {
    constructor() {
        super(`User is not authroised properly`, 401);
    }
}

export default UnAuthorisedError;