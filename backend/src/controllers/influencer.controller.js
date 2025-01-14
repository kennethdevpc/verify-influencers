import { fetchTwitterData } from '../services/influencer.service.js';
import { filterHealthTweets } from '../services/openIA.service.js';
import {
  filterOriginalTweets,
  getUserTweets,
  searchHealthTweets,
} from '../services/twitter.service.js';
export const analyzeInfluencerA = async (req, res) => {
  console.log(req.body);
  res.send('analyzeInfluencer');
};

export const getInfluencerDetails = async (req, res) => {
  res.send('getInfluencerDetails');
};

// Controlador para manejar la búsqueda de datos de un influencer
export const getInfluencerData = async (req, res) => {
  const { name } = req.params;
  res.send(name);
  // try {
  //   // Lógica para obtener datos desde Twitter (o cualquier API)
  //   const data = await fetchTwitterData(name);

  //   res.status(200).json({
  //     success: true,
  //     data,
  //   });
  // } catch (error) {
  //   console.error('Error fetching influencer data:', error.message);
  //   res.status(500).json({
  //     success: false,
  //     message: 'Error fetching influencer data',
  //   });
  // }
};

export const analyzeInfluencer = async (req, res) => {
  try {
    const { username, platform } = req.body;

    if (platform === 'twitter') {
      const data = await searchHealthTweets(username);
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
      message: 'Error al analizar el influencer.',
      error: error.message,
    });
  }
};

export const getUserTweetsFuncion = async (req, res) => {
  console.log(req.body);
  const data = await getUserTweets(req.body.id);
  res.send(data);
};
export const getUserTweetsFiltered = async (req, res) => {
  console.log(req.body);
  const data = await filterOriginalTweets(req.body);
  res.send(data);
};
//---usamos el servicio de openIAPI para obtener los tweets
export const getHealthTweets = async (req, res) => {
  const data = await filterHealthTweets(req.body);
  res.send(data);
};
