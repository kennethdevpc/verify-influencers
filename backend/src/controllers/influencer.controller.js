import { fetchTwitterData } from '../services/influencer.service.js';
import {
  extractClaimsFromTweets,
  extractClaimsFromTweetsfilteredTweets,
  filterHealthTweets,
  RepetedClaims,
} from '../services/openIAB.service.js';
import {
  filterOriginalTweets,
  getUserTweets,
  searchInfluencer,
} from '../services/twitter.service.js';

export const analyzeInfluencer = async (req, res) => {
  try {
    const { username, platform } = req.body;

    if (platform === 'twitter') {
      const data = await searchInfluencer(username);
      return res.json({ success: true, platform, data });
    }

    return res.status(400).json({
      success: false,
      message: 'Plataforma no soportada.',
    });
  } catch (error) {
    console.error('Error analyzing influencer:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing influencer, please review credentials, and keysfor the Tweeter API',
      error: error.message,
      errorStatus: error.response?.status,
      errorDetails: error.response?.data?.detail,
    });
  }
};

export const getUserTweetsFuncion = async (req, res) => {
  try {
    const data = await getUserTweets(req.body.id);
    res.send(data);
  } catch (error) {
    console.error('Error analyzing influencer:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing influencer, please review credentials, and keysfor the Tweeter API',
      error: error.message,
      errorStatus: error.response?.status,
      errorDetails: error.response?.data?.detail,
    });
  }
};

export const getHealthTweets = async (req, res) => {
  const data = await filterHealthTweets(req.body);
  res.send(data);
};
//---usamos el servicio de openIAPI para obtener los tweets
export const getClaims = async (req, res) => {
  const data = await extractClaimsFromTweets(req.body);
  res.send(data);
};
//---usamos el servicio de openIAPI para obtener los tweets
export const getClaimsfilteredTweets = async (req, res) => {
  const data = await extractClaimsFromTweetsfilteredTweets(req.body);
  res.send(data);
};

//---todo delete
export const analyzeInfluencerA = async (req, res) => {
  console.log(req.body);
  res.send('analyzeInfluencer');
};

export const getInfluencerDetails = async (req, res) => {
  res.send('getInfluencerDetails');
};
