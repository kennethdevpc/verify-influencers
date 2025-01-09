import axios from 'axios';

// Función para obtener datos de Twitter
export const fetchTwitterData = async (influencerName) => {
  const apiKey = process.env.TWITTER_API_KEY;

  // Aquí usamos un ejemplo de la API de Twitter
  // const url = `https://api.twitter.com/2/tweets/search/recent?query=${influencerName}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Procesar la respuesta de Twitter
    const tweets = response.data.data || [];
    return tweets;
  } catch (error) {
    console.error('Error fetching data from Twitter API:', error.message);
    throw new Error('Error fetching Twitter data');
  }
};
