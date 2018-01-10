'use strict';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const helmet = require('helmet');

// Constants
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// App
const app = express();

// app.use(helmet());
// app.disable('x-powered-by');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const winston = require('winston');
// const swaggerJSDoc = require('swagger-jsdoc');

const config = require('./config');

// swagger definition
/*
const swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Swagger Definition',
  },
  host: config.host,
  basePath: config.basePath,
};

// options for the swagger docs
const options = {
  swaggerDefinition,
  apis: [],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
*/

winston.level = config.logLevel;

mongoose.connect(config.db, {
  useMongoClient: true,
  keepAlive: 1,
  connectTimeoutMS: 30000,
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
app.get('/', (req, res) => {
  res.render('index.ejs');
});

/*
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
*/

const account = require('./app/user/account.router');

app.use('/', account);

const basicValidator = require('./lib/basicValidator');

const apiRoutes = express.Router();
apiRoutes.use(basicValidator.validation);
app.use('/api', apiRoutes);

const users = require('./app/user/user.router');

apiRoutes.use('/users', users);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (err.isBoom) {
    res.status(err.output.statusCode);
  }
  res.send({
    success: false,
    message: err.message,
  });
});

app.listen(PORT, HOST);
winston.debug(`Running on http://${HOST}:${PORT}`);
