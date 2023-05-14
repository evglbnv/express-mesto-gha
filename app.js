// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

// const { errorHandler } = require('./middlewares/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected'))
  .catch((error) => console.log(`Error during connection ${error}`));

app.use((req, res, next) => {
  req.user = {
    _id: '6453a3ba429d26fe15f89a4e',
  };

  next();
});

app.use('/', router);

// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`);
});
