
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import swaggerDocument from "../util/swagger.json";

export const setupSwagger = (app: Express) => {
  app.use('/swagger/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

};
