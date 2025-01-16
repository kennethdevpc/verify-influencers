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
    
    1. Extrae solo las afirmaciónes sobre salud de este tweet, que tu consideres relevantes , pero no repitas o hagas afirmaciones sin sentido: '${tweet.text}'. separalas con un "-", si no hay una frase no la agregues y tampoco coloques afirmaciones en blanco como afirmaciones. Si NO hay afirmaciones sobre salud en el tweet colocale "null" y no hagas los sigueintes pasos 2 y 3.
    2. ¿A qué categoría pertenece la siguiente afirmación: "${tweet.text}"? Las categorías disponibles son: Nutrición, Medicina, Salud Mental, Ejercicio. Responde solo con la categoría correspondiente.
    3. ¿Cuánta confianza tienes en esta afirmación: "${tweet.text}"? Responde con un puntaje entre 0 y 100 0 significa bajo, 100 mas alto, porfavor dame un dato numerico primero y luego la informacion que encuentras (solo 30 palabras maximo), por ejemplo:  80-La prevención de enfermedades a través de hábitos saludables, chequeos médicos regulares y vacunaciones es fundamental para mantener una buena salud
    
    -Ejemplo de respuesta: evita colocar caracteres especiales, como /" u otras cosas, unicamentq usa el separador -
    tambien modifica los textos en tercera persona, por ejemplo se sugiere, en vez e le sugiero.

    "1. el deporte mejora la salud mental-El ejercicio te da energia en tus actividades",
    "2. Salud Mental",
    "3. 85-El ejercicio regular está asociado con mejoras en la salud mental"


    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });

      // Parsear las respuestas
      const lines = response.choices[0].message.content.trim().split('\n');
      return lines;
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

export async function extractClaimsFromTweetsfilteredTweets(lines) {
  return lines.map((entry) => {
    // Extraer las frases de la "claim"
    const claimsRaw = entry[0]
      .split('-')
      .map((text) => text.trim())
      .filter((text) => text.length > 0);
    const tweet = claimsRaw.join('. '); // Reconstruir el tweet original
    return tweet;
    const claim1 = claimsRaw[0] || '';
    const claim2 = claimsRaw[1] || '';

    // Extraer la categoría
    const category = entry[1].split('.')[1].trim();

    // Extraer el valor y la información del "score"
    const scoreData = entry[2].split('-');
    const value = scoreData[0].trim(); // Extraemos el valor del score
    const information = scoreData[1].trim(); // Extraemos la información adicional

    // Crear las estructuras de los claims
    const claims = [];
    if (claim1) {
      claims.push({
        claim: claim1,
        category: category,
        confidenceScore: [value, information],
      });
    }
    if (claim2) {
      claims.push({
        claim: claim2,
        category: category,
        confidenceScore: [value, information],
      });
    }

    return {
      tweet: tweet,
      claims: claims,
    };
  });
}
