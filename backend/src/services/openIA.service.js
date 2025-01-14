import OpenAI from 'openai'; // Nueva versión del SDK
import dotenv from 'dotenv'; //----dotenv
dotenv.config();
// Configuración de OpenAI con tu clave de API
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});
// Función para filtrar tweets relacionados con la salud usando GPT-4
export async function filterHealthTweets(tweets) {
  const healthTweets = [];
  for (const tweet of tweets) {
    const prompt = `¿El siguiente tweet trata sobre salud? Responde "sí" o "no" pero sin puntos ni comas.\nTweet: "${tweet.text}"`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      const answer = response.choices[0].message.content.trim().toLowerCase();
      if (answer === 'sí') {
        healthTweets.push(tweet);
      }
    } catch (error) {
      console.error('Error al analizar el tweet:', error);
      return error;
    }
  }

  return healthTweets;
}
