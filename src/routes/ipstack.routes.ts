import { Router } from 'express';
import { IPStackController } from '../controllers/ipstack.controller';

const router = Router();

// Get details for a specific IP address
router.get('/ip/:ip', IPStackController.getIPDetails);

// Get details for the current client's IP address
router.get('/current', IPStackController.getCurrentIPDetails);

export default router; 