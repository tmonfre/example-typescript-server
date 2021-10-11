import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

import * as routers from './routers';
import { ServerResponse } from './types';

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// declare routers
app.use('/users', routers.userRouter);

// base route
app.get('/', (_req, res) => {
  res.send(new ServerResponse({}));
});

const port = process.env.PORT || 9090;

app.listen(port, () => {
  console.log(`listening on: ${port}`);
});
