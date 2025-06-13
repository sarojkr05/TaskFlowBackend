import User from '../schemas/userSchema.js';
import BadRequestError from '../utils/badRequestError.js';
import InternalServerError from '../utils/internalSeverError.js'

async function findUser(parameters) {
    try {
        return await User.findOne(parameters);
    } catch (error) {
        console.error(error);
        throw new InternalServerError("Database error while finding user");
    }
}

async function findUserByEmail(email) {
    return await User.findOne({ email })
}

async function createUser(userDetails) {
    try {
        return await User.create(userDetails);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessageList = Object.values(error.errors).map(err => err.message);
            throw new BadRequestError(errorMessageList);
        }
        throw new InternalServerError("Database error while creating user");
    }
}

export { findUser, findUserByEmail, createUser };
