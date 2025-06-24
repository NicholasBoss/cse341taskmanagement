const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Task Management API',
    description: 'API for managing Tasks',
    version: '1.0.0'
  },
  host: 'cse341taskmanagement-lif5.onrender.com',
  schemes: ['https'],
  consumes: ['application/json'],
  components: {
    securitySchemes: {
      OAuth2: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenUrl: 'https://oauth2.googleapis.com/token',
            scopes: {
              openid: 'OpenID Connect',
              email: 'Access to your email address',
              profile: 'Access to your basic profile'
            }
          }
        }
      }
    }
  },
  security: [
    {
      OAuth2: ['openid', 'email', 'profile']
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
