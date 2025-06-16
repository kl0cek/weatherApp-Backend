import express from 'express'
import { getDailySummary, getWeeklySummary } from '../weatherController.js'

const router = express.Router();

router.get('/daily-summary', getDailySummary);
router.get('/weekly-summary', getWeeklySummary);

export default router;