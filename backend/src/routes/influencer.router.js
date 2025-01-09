import express from 'express';
import {
  analyzeInfluencer,
  getInfluencerDetails,
  getInfluencerData,
} from '../controllers/influencer.controller.js';
const router = express.Router();

router.post('/analyze', analyzeInfluencer);
router.get('/details/:id', getInfluencerDetails);
router.get('/data/:name', getInfluencerData);

export default router;
