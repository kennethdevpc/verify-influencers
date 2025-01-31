import axios from 'axios';
import dotenv from 'dotenv'; //----dotenv
dotenv.config(); //----dotenv

export async function scrapeTweets(searchTerm) {
  const API_KEY = `${process.env.SERP_API}`;
  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
    searchTerm + ' site:twitter.com'
  )}&api_key=${API_KEY}`;

  try {
    const response = await axios.get(url);

    if (!response.data.organic_results) {
      console.log('No se encontraron tweets.');
      return response;
    }
    return response.data;
    const tweets = response.data.tweets_results.map((tweet) => ({
      text: tweet.tweet,
      username: tweet.source,
      link: tweet.link,
    }));

    return tweets;
  } catch (error) {
    console.error('Error con SerpAPI:', error);
  }
}
