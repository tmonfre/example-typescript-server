enum ResponseCodes {
  Success = 200,
  NotFound = 404,
  InternalError = 500
}

enum ErrorResponseMessages {
  NotFound = 'document not found',
  InternalError = 'an error was encountered'
}

export {
  ResponseCodes,
  ErrorResponseMessages,
};
