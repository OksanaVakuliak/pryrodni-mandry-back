import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerMiddleware, sendSpec } from '../controllers/docsController.js';

const router = Router();

router.use('/api/docs', swaggerUi.serve, swaggerMiddleware);
router.get('/api/docs/openapi.yaml', sendSpec);

export default router;
