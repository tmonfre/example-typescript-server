import BaseError from './base-error';
import { DefaultErrorMessages } from '../../constants';

class UnauthorizedError extends BaseError {
  constructor(message: string = DefaultErrorMessages.Unauthorized) {
    super(message, { message });
  }
}

export default UnauthorizedError;
