import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerMiddleware, sendSpec } from '../controllers/docsController.js';

const router = Router();

router.use('/', swaggerUi.serve, swaggerMiddleware);
router.get('/openapi.yaml', sendSpec);

export default router;
