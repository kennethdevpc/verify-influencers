import express from 'express';
import { analyzeInfluencer, getInfluencerDetails } from '../controllers/influencer.controller.js';
const router = express.Router();
import influencerRouter from './influencer.router.js';

router.use('/influencer', influencerRouter);

export default router;
