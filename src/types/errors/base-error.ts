import { DefaultErrorMessages } from '../../constants';

class BaseError extends Error {
    name: string;

    message: string;

    data: Record<string, unknown>;

    constructor(
      message: string = DefaultErrorMessages.InternalError,
      data: Record<string, unknown> = {},
    ) {
      super(message);

      this.name = this.constructor.name;
      this.message = message;
      this.data = data;

      Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export default BaseError;
