import { Connection } from 'mysql2/promise';

import UserController from './user';
import MindfulnessEntryController from './mindfulness-entry';

interface InstantiatedControllers {
    User: UserController
    MindfulnessEntry: MindfulnessEntryController
}

export enum ControllerTypes {
  User = 'User',
  MindfulnessEntry = 'MindfulnessEntry'
}

class Controllers {
    private static controllers: InstantiatedControllers

    public static initializeAllControllers(dbConnection: Connection): void {
      this.controllers = {
        User: new UserController(dbConnection),
        MindfulnessEntry: new MindfulnessEntryController(dbConnection),
      };
    }

    public static getControllers(): InstantiatedControllers {
      return this.controllers;
    }
}

export {
  UserController,
  MindfulnessEntryController,
};

export default Controllers;
