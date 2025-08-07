export class HttpError extends Error {
    statusCode: number
    code?: string

    constructor(message: string, statusCode: number, code: string) {
        super(message)
        this.name = "HttpError"
        this.statusCode = statusCode
        this.code = code
    }
}

export class CustomError extends HttpError {
    constructor(message: string, statusCode: number, code: string) {
        super(message, statusCode, code)
    }
}

