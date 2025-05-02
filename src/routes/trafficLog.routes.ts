import { Router } from 'express';
import { TrafficLogController } from '../controllers/trafficLog.controller';

const router = Router();

router.post('/', TrafficLogController.createLog);
router.get('/:id', TrafficLogController.getLogById);
router.get('/', TrafficLogController.getAllLogs);

export const trafficLogRoutes = router; 