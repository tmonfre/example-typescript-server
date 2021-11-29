import { Connection } from 'mysql2/promise';

import UserController from './user';
import EntryController from './entry';

interface InstantiatedControllers {
    User: UserController
    Entry: EntryController
}

export enum ControllerTypes {
  User = 'User',
  Entry = 'Entry'
}

class Controllers {
    private static controllers: InstantiatedControllers

    public static initializeAllControllers(dbConnection: Connection): void {
      this.controllers = {
        User: new UserController(dbConnection),
        Entry: new EntryController(dbConnection),
      };
    }

    public static getControllers(): InstantiatedControllers {
      return this.controllers;
    }
}

export {
  UserController,
  EntryController,
};

export default Controllers;
