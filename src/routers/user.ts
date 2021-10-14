import express, { Request, Response } from 'express';
import { ServerResponse } from '../types';
import { generateErrorResponse, UnauthorizedError } from '../types/errors';
import { extractCredentials } from '../utils/auth';
import { ControllerTypes } from '../controllers';

import {
  useController,
  requireAdmin,
  requireAuth,
  requireAdminOrAuth,
} from '../middleware';

const router = express();

router.route('/auth')
  .get(useController(ControllerTypes.User),
    async (req: Request, res: Response) => {
      if (!req.headers.authorization) throw new UnauthorizedError();
      const credentials = extractCredentials(req.headers.authorization);

      try {
        const user = await res.locals.controller.isAuthedUser(credentials);

        if (user) {
          res.send(new ServerResponse({
            user,
            token: res.locals.controller.tokenForUser(user.email),
          }));
        } else {
          throw new UnauthorizedError();
        }
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    });

router.route('/')
  .get(requireAdmin, useController(ControllerTypes.User),
    async (_req: Request, res: Response) => {
      try {
        const users = await res.locals.controller.getAllUsers();
        res.send(new ServerResponse({ users }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    })
  .post(useController(ControllerTypes.User),
    async (req: Request, res: Response) => {
      if (!req.headers.authorization) throw new UnauthorizedError();
      const { email, password } = extractCredentials(req.headers.authorization);

      try {
        const {
          firstName,
          lastName,
        } = req.body;

        const result = await res.locals.controller.createUser(
          firstName,
          lastName,
          email,
          password,
        );

        res.send(new ServerResponse({ ...result }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    })
  .delete(requireAdmin, useController(ControllerTypes.User),
    async (_req: Request, res: Response) => {
      try {
        const user = await res.locals.controller.deleteAllUsers();
        res.send(new ServerResponse({ ...user }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    });

router.route('/id/:id')
  .get(requireAdminOrAuth, useController(ControllerTypes.User),
    async (req: Request, res: Response) => {
      try {
        const user = await res.locals.controller.getUserById(req.params.id);
        res.send(new ServerResponse({ ...user }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    })
  .put(requireAdminOrAuth, useController(ControllerTypes.User),
    async (req: Request, res: Response) => {
      try {
        const user = await res.locals.controller.updateUserById(req.params.id, req.body);
        res.send(new ServerResponse({ ...user }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    })
  .delete(requireAdmin, useController(ControllerTypes.User),
    async (req: Request, res: Response) => {
      try {
        const user = await res.locals.controller.deleteUserById(req.params.id);
        res.send(new ServerResponse({ ...user }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    });

router.route('/email/:email')
  .get(requireAdminOrAuth, useController(ControllerTypes.User),
    async (req: Request, res: Response) => {
      try {
        const user = await res.locals.controller.getUserByEmail(req.params.email);
        res.send(new ServerResponse({ ...user }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    })
  .put(requireAdminOrAuth, useController(ControllerTypes.User),
    async (req: Request, res: Response) => {
      try {
        const user = await res.locals.controller.updateUserByEmail(req.params.email, req.body);
        res.send(new ServerResponse({ ...user }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    })
  .delete(requireAdmin,
    useController(ControllerTypes.User), async (req: Request, res: Response) => {
      try {
        const user = await res.locals.controller.deleteUserByEmail(req.params.email);
        res.send(new ServerResponse({ ...user }));
      } catch (error) {
        const { statusCode, payload } = generateErrorResponse(error);
        res.status(statusCode).send(new ServerResponse(payload, statusCode));
      }
    });

export default router;
