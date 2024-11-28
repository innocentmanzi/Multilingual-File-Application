const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'File Management API',
      version: '1.0.0',
      description: 'API for file management with multilingual support',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: {
        langQuery: {
          in: 'query',
          name: 'lang',
          schema: {
            type: 'string',
            enum: ['en', 'es'], // Add supported languages here
            default: 'en',
          },
          description: 'Language for the response (default: English)',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the routes for Swagger to read documentation
};

module.exports = swaggerJsDoc(swaggerOptions);
