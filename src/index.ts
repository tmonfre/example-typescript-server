import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function getText(): string {
  return '3Q Web Server';
}

app.get('/', (_req, res) => {
  res.send(getText());
});

const port = process.env.PORT || 9090;

app.listen(port, () => {
  console.log(`listening on: ${port}`);
});
