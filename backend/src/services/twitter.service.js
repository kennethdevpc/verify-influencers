import axios from 'axios';
import { TWITTER_BEARER_TOKEN } from '../config/apiKeys.js';
import Influencer from '../models/Influencer.model.js';
import e from 'express';

const BASE_URL = 'https://api.x.com/2';

// Obtener información de un usuario por nombre de usuario
// export async function getUserByUsername(username) {
//   try {
//     const response = await axios.get(`${BASE_URL}/users/by/username/${username}`, {
//       headers: {
//         Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
//       },
//     });
//     console.log('Response Data:', response.data);
//     return response.data.data;
//   } catch (error) {
//     if (error.response) {
//       console.error('Error Response Data:', error.response.data);
//       console.error('Error Status:', error.response.status);
//     }
//     throw new Error(error.message);
//   }
// }
async function getUserByUsername(username) {
  let userNameJoined = username.split(' ').join('_');

  try {
    const response = await axios.get(`${BASE_URL}/users/by/username/${userNameJoined}`, {
      headers: {
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 30000; // Por defecto 30s
      console.log(`Rate limit exceeded. Retrying after ${waitTime / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return getUserByUsername(username); // Reintento
    } else {
      console.error('Error getting Twitter user:', error.response?.data || error.message);
      throw error;
    }
  }
}
// Obtener tweets de un usuario
export async function getUserTweets(userId, maxResults = 100) {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}/tweets`, {
      headers: {
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
      params: {
        max_results: maxResults,
        'tweet.fields': 'created_at,public_metrics',
        expansions: 'author_id',
        'user.fields': 'username,public_metrics',
        exclude: 'replies,retweets',
      },
      timeout: 10000, // Timeout en milisegundos (10 segundos)
    });
    console.log('Response Data:', response.data);

    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 30000; // Default to 30s
      console.log(`Rate limit exceeded. Retrying after ${waitTime / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return getUserTweets(userId, maxResults); // Retry
    } else {
      console.error('Error getting tweets:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Buscar tweets relacionados con salud
export async function searchHealthTweets(usernameTexted) {
  let user;
  try {
    const userInDBName = await Influencer.findOne({ username: usernameTexted });
    if (userInDBName) {
      user = userInDBName;

      // throw new Error('Usuario ya existe en la base de datos con ese nombre buscar con ese nombre');
    } else {
      const userApi = await getUserByUsername(usernameTexted);
      if (!userApi) throw new Error('Usuario no encontrado');
      const { id, name, username } = userApi; //--exist en api

      const userInDB = await Influencer.findOne({ id });
      if (userInDB) {
        user = userInDB;
      } else {
        const newInflu = new Influencer({
          id,
          name,
          username,
        });
        if (newInflu) {
          // generate jwt token here
          await newInflu.save();
          user = newInflu;
        } else {
          throw new Error('Invalid influencer data');
        }
      }
    }
    return user;
    const tweets = await getUserTweets(user.id);
    return tweets;

    const healthKeywords = ['salud', 'health', 'nutrition', 'diet', 'exercise', 'wellness'];
    const healthTweets = tweets.filter((tweet) =>
      healthKeywords.some((keyword) => tweet.text.toLowerCase().includes(keyword))
    );

    return { user, tweets: healthTweets };
  } catch (error) {
    console.error('Error searching health tweets:', error);
    throw error;
  }
}

export async function searchHealthTweetss(usernameTexted) {
  try {
    const userInDBName = await Influencer.findOne({ username: usernameTexted });
    let user;
    if (userInDBName) {
      user = userInDBName;
    } else {
      user = await getUserByUsername(usernameTexted);
      if (!user) throw new Error('Usuario no encontrado');
      let { id, name, username } = user;
      console.log('buscando por username', user);

      const userInDB = await Influencer.findOne({ id });
      if (userInDB) {
        console.log('ya existe pero el nombre no se encontro inicialmente');
        user = userInDB;
      } else {
        //--si no existe en la base de datos se crea
        const newInflu = new Influencer({
          //--------En mongo se crea un new user, en mysql es con create,
          id,
          name,
          username,
        });
        if (newInflu) {
          // generate jwt token here
          await newInflu.save();
          user = newInflu;
        } else {
          throw new Error('Invalid influencer data');
        }
      }
    }

    return user;
    const tweets = await getUserTweets(user.id);

    const healthKeywords = ['salud', 'health', 'nutrition', 'diet', 'exercise', 'wellness'];
    const healthTweets = tweets.filter((tweet) =>
      healthKeywords.some((keyword) => tweet.text.toLowerCase().includes(keyword))
    );

    return { user, tweets: healthTweets };
  } catch (error) {
    console.error('Error searching health tweets:', error);
    throw error;
  }
}
