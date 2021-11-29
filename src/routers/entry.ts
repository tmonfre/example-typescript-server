import express, { Request, Response } from 'express';

import Controllers from '../controllers';
import { UserModel } from '../models';
import { ServerResponse } from '../types';
import { generateErrorResponse } from '../types/errors';

import {
  requireAdmin,
  requireAdminOrAuth,
  requireAuth,
} from '../middleware';

const router = express();

router.route('/')
  .get(requireAdmin, async (_req: Request, res: Response) => {
    const controller = Controllers.getControllers().Entry;

    try {
      const entries = await controller.getAllEntries();
      res.send(new ServerResponse({ entries }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .post(requireAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().Entry;

    try {
      const { id: userId } = <UserModel> req.user;
      const { exampleValue } = req.body;

      const result = await controller.createEntry(
        userId || 'unknown',
        exampleValue,
      );

      res.send(new ServerResponse({ ...result }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .delete(requireAdmin, async (_req: Request, res: Response) => {
    const controller = Controllers.getControllers().Entry;

    try {
      const entry = await controller.deleteAllEntries();
      res.send(new ServerResponse({ ...entry }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

router.route('/id/:id')
  .get(requireAdminOrAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().Entry;

    try {
      const entry = await controller.getEntryById(req.params.id);
      res.send(new ServerResponse({ ...entry }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .put(requireAdminOrAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().Entry;

    try {
      const entry = await controller.updateEntryById(req.params.id, req.body);
      res.send(new ServerResponse({ ...entry }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  })
  .delete(requireAdmin, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().Entry;

    try {
      const entry = await controller.deleteEntryById(req.params.id);
      res.send(new ServerResponse({ ...entry }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

router.route('/userId/:userId')
  .get(requireAdminOrAuth, async (req: Request, res: Response) => {
    const controller = Controllers.getControllers().Entry;

    try {
      const entries = await controller.getEntriesForUserId(req.params.userId);
      res.send(new ServerResponse({ entries }));
    } catch (error) {
      const { statusCode, payload } = generateErrorResponse(error);
      res.status(statusCode).send(new ServerResponse(payload, statusCode));
    }
  });

export default router;
