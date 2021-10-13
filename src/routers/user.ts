import express, { Request, Response } from 'express';
import { ServerResponse } from '../types';
import Controllers from '../controllers';
import { generateErrorResponse } from '../types/errors';

const router = express();

router.route('/')
  .get(async (_req: Request, res: Response) => {
    const { User: userController } = Controllers.getControllers();

    const users = await userController.getAllUsers();
    res.send(new ServerResponse({ users }));
  })
  .post(async (req: Request, res: Response) => {
    const { User: userController } = Controllers.getControllers();

    try {
      const {
        firstName,
        lastName,
        email,
        saltedPassword,
      } = req.body;

      const result = await userController.createUser(
        firstName,
        lastName,
        email,
        saltedPassword,
      );

      res.send(new ServerResponse({ ...result }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .delete(async (_req: Request, res: Response) => {
    const { User: userController } = Controllers.getControllers();

    try {
      const user = await userController.deleteAllUsers();
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

router.route('/:id')
  .get(async (req: Request, res: Response) => {
    const { User: userController } = Controllers.getControllers();

    try {
      const user = await userController.getUserById(req.params.id);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .put(async (req: Request, res: Response) => {
    const { User: userController } = Controllers.getControllers();

    try {
      const user = await userController.updateUserById(req.params.id, req.body);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .delete(async (req: Request, res: Response) => {
    const { User: userController } = Controllers.getControllers();

    try {
      const user = await userController.deleteUserById(req.params.id);
      res.send(new ServerResponse({ ...user }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

export default router;
