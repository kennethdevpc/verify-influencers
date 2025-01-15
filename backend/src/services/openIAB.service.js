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

  const promises = tweets.map(async (tweet) => {
    const prompt = `¿El siguiente tweet trata sobre salud? Responde "sí" o "no" pero sin puntos ni comas.\nTweet: "${tweet.text}"`;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      const answer = response.choices[0].message.content.trim().toLowerCase();
      return answer === 'sí' ? tweet : null;
      // if (answer === 'sí') {
      //   healthTweets.push(tweet);

      // }
    } catch (error) {
      console.error('Error al analizar el tweet:', error);
      return error;
    }
  });

  const results = await Promise.all(promises);

  // Filtra los resultados para eliminar los "null" (errores o respuestas negativas)
  return results.filter((tweet) => tweet !== null);

  return healthTweets;
}

export async function extractClaimsFromTweets(filteredTweets) {
  const claims = [];
  const promises = filteredTweets.map(async (tweet) => {
    const prompt = `Analiza el siguiente tweet y realiza las siguientes tareas:
    1. Extrae solo las afirmaciónes sobre salud de este tweet, que tu consideres relevantes, pero no repitas o hagas afirmaciones sin sentido: '${tweet.text}'. separalas con un "-", si no hay una frase no la agregues y tampoco coloques afirmaciones en blanco como afirmaciones.
    2. ¿A qué categoría pertenece la siguiente afirmación: "${tweet.text}"? Las categorías disponibles son: Nutrición, Medicina, Salud Mental, Ejercicio. Responde solo con la categoría correspondiente.
    3. ¿Cuánta confianza tienes en esta afirmación: "${tweet.text}"? Responde con un puntaje entre 0 y 100 0 significa bajo, 100 mas alto, porfavor dame un dato numerico primero y luego la informacion que encuentras (solo 30 palabras maximo), por ejemplo:  80-La prevención de enfermedades a través de hábitos saludables, chequeos médicos regulares y vacunaciones es fundamental para mantener una buena salud
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      // Parsear las respuestas
      const lines = response.choices[0].message.content.trim().split('\n');
      return lines;
      const parsedLines = lines.map((entry) => {
        // Extraer las frases de la "claim"
        const claim = entry[0]
          .split('-')
          .map((text) => text.trim())
          .filter((text) => text.length > 0);

        // Extraer la categoría
        const category = entry[1].split('.')[1].trim();

        // Extraer el valor y la información del "score"
        const scoreData = entry[2].split('-');
        const value = parseInt(scoreData[0].trim()); // Extraemos el valor del score
        const information = scoreData[1].trim(); // Extraemos la información adicional

        return {
          claim: claim,
          category: category,
          score: {
            value: value,
            information: information,
          },
        };
      });

      return parsedLines;
      const tweetClaims = lines.map((line) => {
        const [claim, category, confidenceScore] = line.split('|').map((item) => item.trim());
        return { claim, category, confidenceScore: parseInt(confidenceScore) };
      });

      return { tweet: tweet.text, claims: tweetClaims };
    } catch (error) {
      console.error('Error al procesar el tweet:', error);
      return null;
    }
  });

  // Esperar que todas las promesas se resuelvan
  const results = await Promise.all(promises);

  // Filtrar los resultados nulos y agregar a los claims
  results.forEach((result) => {
    if (result) claims.push(result);
  });

  return claims;
}
