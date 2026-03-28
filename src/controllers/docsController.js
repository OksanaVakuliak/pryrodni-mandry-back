import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

export const swaggerMiddleware = (req, res, next) => {
  const filePath = path.resolve('./docs/openapi.yaml');
  fs.promises
    .readFile(filePath, 'utf8')
    .then((raw) => {
      const spec = yaml.load(raw);
      const setup = swaggerUi.setup(spec);
      return setup(req, res, next);
    })
    .catch(next);
};

export const sendSpec = (req, res, next) => {
  const filePath = path.resolve('./docs/openapi.yaml');
  res.sendFile(filePath, (err) => {
    if (err) return next(err);
  });
};

export default { swaggerMiddleware, sendSpec };
