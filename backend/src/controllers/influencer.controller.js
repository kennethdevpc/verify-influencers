import { fetchTwitterData } from '../services/influencer.service.js';
import {
  extractClaimsFromTweets,
  extractClaimsFromTweetsfilteredTweets,
  filterHealthTweets,
  addTweetsToDB,
  getAllTweets,
  RepetedClaims,
  getTweetsInfluencer,
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
    // const data = await extractClaimsFromTweetsfilteredTweets(req.body);
    //---cambiado 22 enero

    const data = await RepetedClaims(req.body);

    res.send(data);
  } catch (error) {
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
//---todo delete

export const getUserTweetsFuncionDelete = async (req, res) => {
  let dataBody = req.params.id; //---ejecuta endpoint : tweets
  // let dataBody = req.body; //---ejecuta endpoint : tweetsb
  try {
    const data = await getUserTweets(dataBody);

    if (data[0].author_id) {
      console.log('Procesando datos from body o teewts');

      const healthTweets = await filterHealthTweets(data);
      if (healthTweets.success) {
        const claimsFromTweets = await healthTweets.message;
        const tweetsDb = await addTweetsToDB(claimsFromTweets);

        // res.send(tweetsDb);
        // const tweets = await getAllTweets();
        const tweets = await getTweetsInfluencer(dataBody);
        res.status(200).json(tweets);
      } else {
        // res.send(healthTweets);
        const tweets = await getTweetsInfluencer(dataBody);

        // const tweets = await getAllTweets();
        res.status(200).json(tweets);
      }
    } else {
      const tweets = await getTweetsInfluencer(dataBody);

      // const tweets = await getAllTweets();
      if (tweets.length > 0) {
        console.log('datos desde db');

        res.status(200).json(tweets);
      } else {
        console.log('no hay datos envia el error');

        res.status(200).json(data);
      }

      // res.status(200).json(tweets);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

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
