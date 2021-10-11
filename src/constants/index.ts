enum ResponseCodes {
  Success = 200,
  NotFound = 404,
  InternalError = 500
}

enum DefaultErrorMessages {
  NotFound = 'document not found',
  InternalError = 'an error was encountered'
}

export {
  ResponseCodes,
  DefaultErrorMessages,
};
