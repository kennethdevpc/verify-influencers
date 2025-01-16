import express from 'express';
import {
  analyzeInfluencer,
  getInfluencerDetails,
  getInfluencerData,
  getUserTweetsFuncion,
  getHealthTweets,
  getClaims,
  getClaimsfilteredTweets,
} from '../controllers/influencer.controller.js';
const router = express.Router();

router.post('/analyze', analyzeInfluencer);
router.post('/tweets', getUserTweetsFuncion);
router.post('/tweetsjson', getUserTweetsFuncion);
router.post('/healthTweets', getHealthTweets);
router.post('/claims', getClaims);
router.post('/claimsfilteredTweets', getClaimsfilteredTweets);
router.get('/details/:id', getInfluencerDetails);
router.get('/data/:name', getInfluencerData);

export default router;
