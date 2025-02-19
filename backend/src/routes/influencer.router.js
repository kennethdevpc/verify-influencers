import express from 'express';
import {
  analyzeInfluencer,
  getInfluencerDetails,
  getUserTweetsFuncion,
  getHealthTweets,
  getClaims,
  getClaimsfilteredTweets,
  insertTweetsIndB,
  getUserTweetsFuncionDelete,
  getInfluencers,
  getInfluencersDetails,
  getInfluencersFromSerpApi,
} from '../controllers/influencer.controller.js';
const router = express.Router();
router.get('/seapApi', getInfluencersFromSerpApi);

router.post('/analyze', analyzeInfluencer); //--obtengo usuario y sus detalles Id y nombre
router.get('/tweets/:id', getUserTweetsFuncionDelete); //--obtengo los tweets (100 maximo), de un usuario
router.post('/tweetsb/:id', getUserTweetsFuncionDelete); //todo eliminar endpoint pero primero debo agregarselo a el original
router.post('/tweetsDb', insertTweetsIndB); //--todo eliminar endpoint

router.post('/healthTweets', getHealthTweets); //---filtra todo lo que tiene que ver son salu
router.post('/claims', getClaims); //---Extrae todas las afirmaciones, es decir todos los textos, y genere una categoria y un score
router.post('/claimsfilteredTweets', getClaimsfilteredTweets); //--obtengo de manera ordenada y filtrada sin repeticiones

router.get('/influencers', getInfluencers); //---obtengo los influencers
router.get('/details/:id', getInfluencersDetails); //---obtengo los el detalle de un influencer
//todo Obtener from database
// router.get('/details/:id', getInfluencerDetails);

export default router;
