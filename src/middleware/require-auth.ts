import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import Controllers from '../controllers';
import { ServerResponse } from '../types';
import { ForbiddenError, generateErrorResponse, UnauthorizedError } from '../types/errors';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await Controllers.getControllers().User.getUserByEmail(payload.sub);
    return done(null, user || false);
  } catch (error) {
    console.error(error);
    return done(null, false);
  }
});

passport.use(jwtLogin);

// transmits result of authenticate() call to user or next middleware
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const { id: userId, email } = req.params;

    // return any existing errors
    if (err) { return next(err); }

    // if no user found or incorrect user, return appropriate error message
    if (!user) {
      const { statusCode, payload } = generateErrorResponse(new UnauthorizedError('Error authenticating email and password'));
      return res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }

    // only allow to continue if user is making request on self
    if ((userId && userId !== user.id) || (email && email !== user.email)) {
      const { statusCode, payload } = generateErrorResponse(new ForbiddenError());
      return res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }

    req.user = user;

    return next();
  })(req, res, next);
}

export default requireAuth;
