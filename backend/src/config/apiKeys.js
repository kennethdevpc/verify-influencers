import dotenv from 'dotenv';
dotenv.config();

console.log('ssss', process.env.PORT);
export const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
