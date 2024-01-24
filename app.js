require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const options = {
  origin: [
    'http://localhost:3000',
    // 'https://ВАШ ДОМЕЙН С ДОКУМЕНТА',
    // 'https://YOUR.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const { DB_ADDRESS, NODE_ENV } = process.env;

const routes = require('./routes/index');

const PORT = 3000;
const app = express();
app.use(cors(options));

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://127.0.0.1:27017/movie')
  .catch((err) => {
    if (err) throw err;
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(requestLogger);
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
