import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grocery Shop API',
      version: '1.0.0',
      description: 'API documentation for the Grocery Shop application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default specs;
