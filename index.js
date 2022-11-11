const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const fileUpload = require('express-fileupload');

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const swaggerJSDoc = require('swagger-jsdoc');
const showBanner = require('node-banner');

dotenv.config();





mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true },
  () => {
    console.log('Database is connected');
  }
);
//middlewear
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors());
app.use(fileUpload());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CA-Api',
      version: '1.0.0',
      description: 'A api backend of portal for CA',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

app.use('/api/user', userRoute);

app.use('/api/auth', authRoute);

app.use('/api/admin', adminRoute);

const specs = swaggerJsDoc(options);

 
(async () => {
  await showBanner('CA-BACKEND', 'A Product of Staple Logic');
})();


app.listen(process.env.PORT, () => {
  console.log('');
});


