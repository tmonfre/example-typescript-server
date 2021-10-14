export interface AuthCredentials {
    email: string
    password: string
}

// given authorization header, return username and password
// adapted from: https://gist.github.com/charlesdaniel/1686663
export function extractCredentials(authorization: string): AuthCredentials {
  const auth = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':');

  return {
    email: auth[0],
    password: auth[1],
  };
}
