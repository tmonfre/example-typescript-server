import BaseError from './base-error';
import { DefaultErrorMessages } from '../../constants';

class ForbiddenError extends BaseError {
  constructor(message: string = DefaultErrorMessages.Forbidden) {
    super(message, { message });
  }
}

export default ForbiddenError;
