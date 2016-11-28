import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import Base from './app/routes/base';

const app = express();
const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', Base);
app.listen(port);

export default app;
