import AppError from "../../pkg/error/error.js";

export class BadRequestException extends AppError{
    constructor(message:string ){
        super(message , 400)
    }
}
export class NotFoundException extends AppError{
    constructor(message:string ){
        super(message , 404)
    }
}
export class ForbiddenException extends AppError{
    constructor(message:string ){
        super(message , 403)
    }
}
export class ConflictException extends AppError{
    constructor(message:string ){
        super(message , 409)
    }
}
export class UnAuthorizedException extends AppError{
    constructor(message:string ){
        super(message , 401)
    }
}
export class TooManyRequestsException extends AppError{
    constructor(message:string ){
        super(message , 429)
    }
}