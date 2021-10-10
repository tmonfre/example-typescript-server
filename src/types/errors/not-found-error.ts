import BaseError from './base-error';
import { ErrorResponseMessages } from '../../constants';

class NotFoundError extends BaseError {
  constructor(
    message: string = ErrorResponseMessages.NotFound,
    documentId: string,
  ) {
    super(message, {
      documentId,
    });
  }
}

export default NotFoundError;
