import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

import * as routers from './routers';
import { ServerResponse } from './types';
import DB from './models/db';
import Tables from './models';
import Controllers from './controllers';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// declare routers
app.use('/users', routers.userRouter);
app.use('/mindfulness-entries', routers.mindfulnessEntryRouter);

// base route
app.get('/', (_req, res) => {
  res.send(new ServerResponse({}));
});

const port = process.env.PORT || 9090;

app.listen(port, async () => {
  console.log(`listening on: ${port}`);

  try {
    // connect to db
    const connection = await DB.getConnection();
    console.log('connected to database');

    // initialize all tables in database
    await Tables.initializeAllTables(connection);
    console.log('initialized all database tables');

    // initialize all controller objects with model references
    Controllers.initializeAllControllers(connection);
    console.log('initialized all controllers');
  } catch (error) {
    console.error('failed to initialize database setup');
    console.error(error);
  }
});
