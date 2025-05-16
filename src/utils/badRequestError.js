import AppError from "./appError.js";

class BadRequestError extends Error {
    constructor(invalidParams = []) {
      super("Invalid request parameters");
      this.name = "BadRequestError";
      this.statusCode = 400;
      this.invalidParams = Array.isArray(invalidParams) ? invalidParams : [invalidParams];
    }
  }

export default BadRequestError;