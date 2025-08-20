export class customError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);          // call built-in Error constructor
    this.code = code;        // attaching a custom error code
    Object.setPrototypeOf(this, customError.prototype); // fix instanceof
  }
}
