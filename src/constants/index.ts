enum ResponseCodes {
  Success = 200,
  NotFound = 404,
  InternalError = 500
}

enum DefaultErrorMessages {
  NotFound = 'document not found',
  InternalError = 'an error was encountered'
}

enum DBTableNames {
  Users = 'Users'
}

export {
  ResponseCodes,
  DefaultErrorMessages,
  DBTableNames,
};
