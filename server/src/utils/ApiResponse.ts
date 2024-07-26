export class ApiResponse {
    success: boolean;
    constructor(
        public statusCode: number,
        public message: string = 'success',
        public data?: any,
    ) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
