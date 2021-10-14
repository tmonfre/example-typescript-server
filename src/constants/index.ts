enum ResponseCodes {
  Success = 200,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalError = 500
}

enum DefaultErrorMessages {
  Unauthorized = 'unauthorized',
  Forbidden = 'forbidden',
  NotFound = 'document not found',
  InternalError = 'an error was encountered'
}

enum DBTableNames {
  Users = 'Users',
  MindfulnessEntries = 'MindfulnessEntries'
}

export {
  DBTableNames,
  DefaultErrorMessages,
  ResponseCodes,
};
