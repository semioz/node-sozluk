interface AppErrorProps {
    statusCode: number;
}

class AppError extends Error implements AppErrorProps{
    statusCode: number;
    status:string;
    isOperational:boolean;

    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(`4`) ? `fail` : `error`
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
};

export default AppError;