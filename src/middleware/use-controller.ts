import { Request, Response, NextFunction } from 'express';

import Controllers, { ControllerTypes } from '../controllers';

function useController(controllerName: ControllerTypes) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.locals.controller = Controllers.getControllers()[controllerName];
    next();
  };
}

export default useController;
