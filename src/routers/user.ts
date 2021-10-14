import express, { Request, Response } from 'express';

import Controllers from '../controllers';
import { ServerResponse } from '../types';
import { generateErrorResponse, UnauthorizedError } from '../types/errors';
import { extractCredentials } from '../utils/auth';

import {
  requireAdmin,
  requireAdminOrAuth,
} from '../middleware';

const router = express();

router.route('/auth')
  .get(async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    if (!req.headers.authorization) throw new UnauthorizedError();
    const credentials = extractCredentials(req.headers.authorization);

    try {
      const user = await controller.isAuthedUser(credentials);

      if (user) {
        res.send(new ServerResponse({
          user,
          token: controller.tokenForUser(user.email),
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
  .get(requireAdmin, async (_req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const users = await controller.getAllUsers();
      res.send(new ServerResponse({ users }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .post(async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    if (!req.headers.authorization) throw new UnauthorizedError();
    const { email, password } = extractCredentials(req.headers.authorization);

    try {
      const {
        firstName,
        lastName,
      } = req.body;

      const result = await controller.createUser(
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
  .delete(requireAdmin, async (_req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const user = await controller.deleteAllUsers();
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

router.route('/id/:id')
  .get(requireAdminOrAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const user = await controller.getUserById(req.params.id);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .put(requireAdminOrAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const user = await controller.updateUserById(req.params.id, req.body);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .delete(requireAdmin, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const user = await controller.deleteUserById(req.params.id);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

router.route('/email/:email')
  .get(requireAdminOrAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const user = await controller.getUserByEmail(req.params.email);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .put(requireAdminOrAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const user = await controller.updateUserByEmail(req.params.email, req.body);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .delete(requireAdmin, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().User;

    try {
      const user = await controller.deleteUserByEmail(req.params.email);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

export default router;
