import { ResponseCodes } from '../../constants';

import BaseError from './base-error';
import NotFoundError from './not-found-error';

interface ErrorResponse {
    statusCode: number
    payload: Record<string, unknown>
}

export function generateErrorResponse(rawError: unknown): ErrorResponse {
  const error = JSON.parse(JSON.stringify(rawError));

  let statusCode = ResponseCodes.InternalError;
  let payload = { error };

  if (error.name === 'NotFoundError') {
    statusCode = ResponseCodes.NotFound;
    payload = { error: (<NotFoundError> error).data };
  }

  return { statusCode, payload };
}

export {
  BaseError,
  NotFoundError,
};
