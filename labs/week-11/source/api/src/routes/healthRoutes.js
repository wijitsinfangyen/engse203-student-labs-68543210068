import { Router } from 'express';
import { config } from '../config.js';
import { getDbStatus } from '../services/requestService.js';
const router=Router();
router.get('/',(req,res)=>res.json({status:'ok',env:config.env,uptimeSeconds:Math.round(process.uptime()),uptime:process.uptime(),database:getDbStatus()}));
export default router;
