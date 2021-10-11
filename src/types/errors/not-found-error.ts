import BaseError from './base-error';
import { DefaultErrorMessages } from '../../constants';

class NotFoundError extends BaseError {
  constructor(
    message: string = DefaultErrorMessages.NotFound,
    documentId: string,
  ) {
    super(message, {
      documentId,
    });
  }
}

export default NotFoundError;
