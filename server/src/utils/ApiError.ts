export class ApiError extends Error {
    sucess: boolean;
    constructor(
        public statusCode: number,
        public message: string = 'Somthing went wrong',
        public error = [],
        stack: string = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = error;
        this.sucess = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
