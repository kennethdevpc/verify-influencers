import axios from 'axios';
import { TWITTER_BEARER_TOKEN } from '../config/apiKeys.js';
import Influencer from '../models/Influencer.model.js';
import e, { text } from 'express';

const BASE_URL = 'https://api.x.com/2';

//Buscar tweets relacionados con salud
export async function searchInfluencer(usernameTexted) {
  let user;
  try {
    const userInDBName = await Influencer.findOne({ username: usernameTexted });
    if (userInDBName) {
      user = userInDBName;

      // throw new Error('Usuario ya existe en la base de datos con ese nombre buscar con ese nombre');
    } else {
      const userApi = await getUserByUsername(usernameTexted);
      if (!userApi) throw new Error('Usuario no encontrado');
      const { id, name, username, profile_image_url, description, public_metrics } = userApi; //--exist en api

      const userInDB = await Influencer.findOne({ id });
      if (userInDB) {
        user = userInDB;
      } else {
        const newInflu = new Influencer({
          id,
          name,
          username,
          profileImageUrl: profile_image_url,
          description,
          followers: public_metrics?.followers_count || 0,
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
  } catch (error) {
    throw error;
  }
}
async function getUserByUsername(username) {
  let userNameJoined = username.split(' ').join('_');

  try {
    const response = await axios.get(`${BASE_URL}/users/by/username/${userNameJoined}`, {
      headers: {
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
      params: {
        'user.fields': 'profile_image_url,description,public_metrics', // Añadimos campos adicionales
      },
    });
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw {
        success: false,
        message: 'Error too many requests, change your Tweeter API keys',
        error: error.message,
        errorStatus: error?.status,
        errorCode: error?.code,
      };

      // const retryAfter = error.response.headers['retry-after'];
      // const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 30000; // Por defecto 30s
      // console.log(`Rate limit exceeded. Retrying after ${waitTime / 1000}s...`);
      // await new Promise((resolve) => setTimeout(resolve, waitTime));
      // return getUserByUsername(username); // Reintento
    } else {
      throw error;
    }
  }
}
// Obtener tweets de un usuario
export async function getUserTweetsoriginal(userId, maxResults = 100) {
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
        // exclude: 'replies,retweets',
      },
      timeout: 10000, // Timeout en milisegundos (10 segundos)
    });
    console.log('Response Data:', response.data);

    let twwitsfiltered = filterOriginalTweets(response.data.data);
    //-----espacio para ejecutar el envio de los tweets a la base de datos

    const twwitsToDB = twwitsfiltered.map((data) => ({
      id: data.id,
      InfluencerId: data.auth,
      created_at,
    }));
    // Inserta todos los documentos usando `insertMany`
    await DataTweet.insertMany(twwitsToDB);

    return twwitsfiltered;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw {
        success: false,
        message: 'Error too many requests, change your Tweeter API keys',
        error: error.message,
        errorStatus: error?.status,
        errorCode: error?.code,
      };
    } else {
      throw error;
    }
  }
}
export function filterOriginalTweets(tweets) {
  return tweets.filter((tweet) => {
    const isReply = tweet.text.trim().startsWith('@');
    const isRetweet = tweet.text.trim().startsWith('RT @');
    return !isReply && !isRetweet;
  });
}
//-----------test getusertweets

// Obtener tweets de un usuario
export async function getUserTweets(data, maxResults = 100) {
  try {
    // const response = await axios.get(`${BASE_URL}/users/${userId}/tweets`, {
    //   headers: {
    //     Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
    //   },
    //   params: {
    //     max_results: maxResults,
    //     'tweet.fields': 'created_at,public_metrics',
    //     expansions: 'author_id',
    //     'user.fields': 'username,public_metrics',
    //     // exclude: 'replies,retweets',
    //   },
    //   timeout: 10000, // Timeout en milisegundos (10 segundos)
    // });
    // console.log('Response Data:', response.data);

    // let twwitsfiltered = filterOriginalTweets(response.data.data);
    let twwitsfiltered = filterOriginalTweets(data);

    return twwitsfiltered;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw {
        success: false,
        message: 'Error too many requests, change your Tweeter API keys',
        error: error.message,
        errorStatus: error?.status,
        errorCode: error?.code,
      };
    } else {
      throw error;
    }
  }
}
