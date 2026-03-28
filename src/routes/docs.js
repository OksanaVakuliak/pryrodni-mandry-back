import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerMiddleware, sendSpec } from '../controllers/docsController.js';

const router = Router();

router.use('/docs', swaggerUi.serve, swaggerMiddleware);
router.get('/docs/openapi.yaml', sendSpec);

export default router;
