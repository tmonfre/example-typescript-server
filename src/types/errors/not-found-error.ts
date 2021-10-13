import BaseError from './base-error';
import { DefaultErrorMessages } from '../../constants';

class NotFoundError extends BaseError {
  constructor(
    documentId: string,
    message: string = DefaultErrorMessages.NotFound,
  ) {
    super(message, {
      documentId,
    });
  }
}

export default NotFoundError;
