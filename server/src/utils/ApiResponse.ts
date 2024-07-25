export class ApiResponse {
    success: boolean;
    constructor(
        public statusCode: number,
        public data: any,
        public message: string = 'success'
    ) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
