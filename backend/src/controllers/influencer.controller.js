import { fetchTwitterData } from '../services/influencer.service.js';
import {
  extractClaimsFromTweets,
  extractClaimsFromTweetsfilteredTweets,
  filterHealthTweets,
  addTweetsToDB,
} from '../services/openIAB.service.js';
import { getUserTweets, searchInfluencer } from '../services/twitter.service.js';

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
    res.status(500).json(error);
  }
};

export const getUserTweetsFuncion = async (req, res) => {
  let id = req.params.id;
  try {
    const data = await getUserTweets(id);
    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getHealthTweets = async (req, res) => {
  try {
    const data = await filterHealthTweets(req.body);
    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
//---usamos el servicio de openIAPI para obtener los tweets
export const getClaims = async (req, res) => {
  try {
    const data = await extractClaimsFromTweets(req.body);
    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
//---usamos el servicio de openIAPI para obtener los tweets
export const getClaimsfilteredTweets = async (req, res) => {
  try {
    const data = await extractClaimsFromTweetsfilteredTweets(req.body);
    res.send(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

//---todo delete
export const insertTweetsIndB = async (req, res) => {
  try {
    const dataFromPostman = await addTweetsToDB(req.body);
    console.log('------------', dataFromPostman);
    res.send(dataFromPostman);
  } catch (error) {}
};
export const analyzeInfluencerA = async (req, res) => {
  console.log(req.body);
  res.send('analyzeInfluencer');
};

export const getInfluencerDetails = async (req, res) => {
  res.send('getInfluencerDetails');
};
