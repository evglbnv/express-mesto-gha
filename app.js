// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const {errors} = require('celebrate')
const {handleErrors} = require('./middlewares/handleErrors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected'))
  .catch((error) => console.log(`Error during connection ${error}`));

app.use('/', router);

app.use(handleErrors);

app.use(errors());

app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`);
});
