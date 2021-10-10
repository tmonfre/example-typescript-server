import express, { Request, Response } from 'express';
import { ServerResponse } from '../types';

const router = express();

// find and return all users
router.route('/')
  .get(async (_req: Request, res: Response) => {
    res.send(new ServerResponse({}));
  });

export default router;
