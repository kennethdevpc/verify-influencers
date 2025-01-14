import OpenAI from 'openai'; // Nueva versión del SDK
import dotenv from 'dotenv'; //----dotenv
dotenv.config();
// Configuración de OpenAI con tu clave de API
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

// Función para filtrar tweets relacionados con la salud usando GPT-4
export async function filterHealthTweets(tweets) {
  console.log('------\n', 'entrando', '*******\n');

  const healthTweets = [];
  for (const tweet of tweets) {
    const prompt = `¿El siguiente tweet trata sobre salud? Responde "sí" o "no" pero sin puntos ni comas.\nTweet: "${tweet.text}"`;

    try {
      // Usamos el modelo gpt-4 para hacer la predicción
      const response = await openai.chat.completions.create({
        // model: 'gpt-3.5-turbo',
        model: 'gpt-4o-mini',
        // model: 'gpt-3.5-1106',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente que filtra tweets relacionados con la salud',
          },
          { role: 'user', content: prompt },
        ],
      });

      console.log('------\n', response.choices[0], '*******\n');
      // Comprobamos la respuesta para ver si el tweet es relevante para la salud
      const answer = response.choices[0].message.content.trim().toLowerCase();
      if (answer === 'sí') {
        healthTweets.push(tweet); // Añadimos el tweet a los tweets de salud
      }
    } catch (error) {
      console.error('Error al analizar el tweet:', error);
      return error;
    }
  }

  return healthTweets;
}
const openai2 = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
  // apiKey: `${process.env.OPENAI_API_KEY}`,
});
export async function filterHealthTweets2(tweets) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'developer', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: 'Write a haiku about recursion in programming.',
        },
      ],
    });

    console.log(completion.choices[0].message);
  } catch (error) {
    return error;
  }
}
