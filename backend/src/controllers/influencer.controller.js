import { fetchTwitterData } from '../services/influencer.service.js';
import {
  extractClaimsFromTweets,
  extractClaimsFromTweetsfilteredTweets,
  filterHealthTweets,
  addTweetsToDB,
  getAllTweets,
  RepetedClaims,
  getTweetsInfluencer,
  getInfluencersService,
  getInfluencersIdService,
} from '../services/openIAB.service.js';
import { getUserTweets, searchInfluencer } from '../services/twitter.service.js';
import stringSimilarity from 'string-similarity';
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
        let situation = (data[0].situation = 'with out data from DB');
        res.status(200).json(data);
      }

      // res.status(200).json(tweets);
    }
  } catch (error) {
    console.log('Error:', error);
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

export const getInfluencers = async (req, res) => {
  const tweets = await getInfluencersService();
  let principalData = tweets.map(async (tweet) => {
    console.log('------', tweet.id);
    let data = await getInfluencersDetailsGeneral(tweet.id);
    return data;
    // getInfluencersDetailsGeneral;
  });

  const principalDataWithDetails = await Promise.all(principalData);

  res.send(principalDataWithDetails);
};

export const getInfluencersDetailsGeneral = async (req, res) => {
  let id = req;
  const details = await getInfluencersIdService(id);
  const tweets = await getTweetsInfluencer(id);
  const characteristics = 0;
  let scoreData = 0;
  let verifiedClaims = 0;

  let cantNutrition = 0;
  let cantMedicine = 0;
  let cantMentalHealth = 0;
  let cantFitness = 0;
  let cantExercise = 0;

  for (let i = 0; i < tweets.length; i++) {
    scoreData = scoreData + parseInt(tweets[i].cleanedPhrase.split('|')[0]);

    const statusVerified = tweets[i].statusAnalysis.toLowerCase().replace(/\s/g, ''); // Convertir a minúsculas y eliminar espacios
    const similarity = stringSimilarity.compareTwoStrings(statusVerified, 'verified');
    if (similarity >= 0.7) {
      verifiedClaims++;
    }

    //---Nutrition, Medicine, MentalHealth, Fitness,Exercise,
    const statusCategory = tweets[i].categoryType.toLowerCase().replace(/\s/g, ''); // Convertir a minúsculas y eliminar espacios
    const nutrition = stringSimilarity.compareTwoStrings(statusCategory, 'nutrition');
    const medicine = stringSimilarity.compareTwoStrings(statusCategory, 'medicine');
    const mentalHealth = stringSimilarity.compareTwoStrings(statusCategory, 'mentalhealth');
    const fitness = stringSimilarity.compareTwoStrings(statusCategory, 'fitness');
    const exercise = stringSimilarity.compareTwoStrings(statusCategory, 'exercise');
    console.log(statusCategory);
    if (nutrition >= 0.6) {
      cantNutrition = cantNutrition + 1;
    } else if (medicine >= 0.6) {
      cantMedicine = cantMedicine + 1;
    } else if (mentalHealth >= 0.6) {
      cantMentalHealth = cantMentalHealth + 1;
    } else if (fitness >= 0.6) {
      cantFitness = cantFitness + 1;
    } else if (exercise >= 0.6) {
      cantExercise = cantExercise + 1;
    }
  }
  console.log(
    'cantNutrition:',
    cantNutrition,
    'cantMedicine:',
    cantMedicine,
    'cantMentalHealth:',
    cantMentalHealth,
    'cantFitness:',
    cantFitness,
    'cantExercise:',
    cantExercise
  );

  // Crear un objeto con las categorías que tengan más de 1 tweet
  const categoriesWithCount = {
    Nutrition: cantNutrition >= 1 ? cantNutrition : null,
    Medicine: cantMedicine >= 1 ? cantMedicine : null,
    Mental_Health: cantMentalHealth > 1 ? cantMentalHealth : null,
    Fitness: cantFitness >= 1 ? cantFitness : null,
    Exercise: cantExercise >= 1 ? cantExercise : null,
  };

  // Filtrar el objeto para eliminar las categorías con null (menos de 2 tweets)
  const filteredCategories = Object.fromEntries(
    Object.entries(categoriesWithCount).filter(([_, value]) => value !== null)
  );
  console.log(filteredCategories);

  let score = Math.ceil(scoreData / tweets.length);

  let data = {
    details,
    name: details[0].name,
    profileImage: details[0].profileImageUrl,
    filteredCategories,
    score,
    followers: details[0].followers,
    verifiedClaims,
  };

  return data;
};
export const getInfluencersDetails = async (req, res) => {
  let id = req.params.id;
  const details = await getInfluencersIdService(id);
  const tweets = await getTweetsInfluencer(id);
  const characteristics = 0;
  let scoreData = 0;
  let verifiedClaims = 0;

  let cantNutrition = 0;
  let cantMedicine = 0;
  let cantMentalHealth = 0;
  let cantFitness = 0;
  let cantExercise = 0;

  for (let i = 0; i < tweets.length; i++) {
    scoreData = scoreData + parseInt(tweets[i].cleanedPhrase.split('|')[0]);

    const statusVerified = tweets[i].statusAnalysis.toLowerCase().replace(/\s/g, ''); // Convertir a minúsculas y eliminar espacios
    const similarity = stringSimilarity.compareTwoStrings(statusVerified, 'verified');
    if (similarity >= 0.7) {
      verifiedClaims++;
    }

    //---Nutrition, Medicine, MentalHealth, Fitness,Exercise,
    const statusCategory = tweets[i].categoryType.toLowerCase().replace(/\s/g, ''); // Convertir a minúsculas y eliminar espacios
    const nutrition = stringSimilarity.compareTwoStrings(statusCategory, 'nutrition');
    const medicine = stringSimilarity.compareTwoStrings(statusCategory, 'medicine');
    const mentalHealth = stringSimilarity.compareTwoStrings(statusCategory, 'mentalhealth');
    const fitness = stringSimilarity.compareTwoStrings(statusCategory, 'fitness');
    const exercise = stringSimilarity.compareTwoStrings(statusCategory, 'exercise');
    console.log(statusCategory);
    if (nutrition >= 0.6) {
      cantNutrition = cantNutrition + 1;
    } else if (medicine >= 0.6) {
      cantMedicine = cantMedicine + 1;
    } else if (mentalHealth >= 0.6) {
      cantMentalHealth = cantMentalHealth + 1;
    } else if (fitness >= 0.6) {
      cantFitness = cantFitness + 1;
    } else if (exercise >= 0.6) {
      cantExercise = cantExercise + 1;
    }
  }
  console.log(
    'cantNutrition:',
    cantNutrition,
    'cantMedicine:',
    cantMedicine,
    'cantMentalHealth:',
    cantMentalHealth,
    'cantFitness:',
    cantFitness,
    'cantExercise:',
    cantExercise
  );

  // Crear un objeto con las categorías que tengan más de 1 tweet
  const categoriesWithCount = {
    Nutrition: cantNutrition >= 1 ? cantNutrition : null,
    Medicine: cantMedicine >= 1 ? cantMedicine : null,
    Mental_Health: cantMentalHealth > 1 ? cantMentalHealth : null,
    Fitness: cantFitness >= 1 ? cantFitness : null,
    Exercise: cantExercise >= 1 ? cantExercise : null,
  };

  // Filtrar el objeto para eliminar las categorías con null (menos de 2 tweets)
  const filteredCategories = Object.fromEntries(
    Object.entries(categoriesWithCount).filter(([_, value]) => value !== null)
  );
  console.log(filteredCategories);

  let score = Math.ceil(scoreData / tweets.length);

  let data = {
    details,
    name: details[0].name,
    profileImage: details[0].profileImageUrl,
    filteredCategories,
    score,
    followers: details[0].followers,
    verifiedClaims,
  };

  res.send(data);
};
