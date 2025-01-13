import express from 'express';
import {
  analyzeInfluencer,
  getInfluencerDetails,
  getInfluencerData,
  getUserTweetsFuncion,
} from '../controllers/influencer.controller.js';
const router = express.Router();

router.post('/analyze', analyzeInfluencer);
router.post('/tweets', getUserTweetsFuncion);
router.post('/tweetsjson', getUserTweetsFuncion);
router.get('/details/:id', getInfluencerDetails);
router.get('/data/:name', getInfluencerData);

export default router;
