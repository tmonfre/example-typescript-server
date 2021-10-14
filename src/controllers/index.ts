import { Connection } from 'mysql2/promise';

import UserController from './user';

interface InstantiatedControllers {
    User: UserController
}

export enum ControllerTypes {
  User = 'User',
}

class Controllers {
    private static controllers: InstantiatedControllers

    public static initializeAllControllers(dbConnection: Connection): void {
      this.controllers = {
        User: new UserController(dbConnection),
      };
    }

    public static getControllers(): InstantiatedControllers {
      return this.controllers;
    }
}

export default Controllers;
