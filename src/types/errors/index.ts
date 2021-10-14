import { ResponseCodes } from '../../constants';

import BaseError from './base-error';
import NotFoundError from './not-found';
import UnauthorizedError from './unauthorized';
import ForbiddenError from './forbidden';

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
  } else if (error.name === 'UnauthorizedError') {
    statusCode = ResponseCodes.Unauthorized;
    payload = { error: (<UnauthorizedError> error).data };
  } else if (error.name === 'ForbiddenError') {
    statusCode = ResponseCodes.Forbidden;
    payload = { error: (<ForbiddenError> error).data };
  }

  return { statusCode, payload };
}

export {
  BaseError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
