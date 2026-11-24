export default class AppError extends Error {
  statusCode;
  isOperational;
  constructor(message:string, statusCode:number, isOperational:boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
