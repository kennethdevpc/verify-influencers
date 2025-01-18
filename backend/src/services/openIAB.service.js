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
      throw {
        success: false,
        message:
          'Error analyzing Api open IA, please review credentials, and keysfor the OpenIA API',
        error: error.message,
        errorStatus: error?.status,

        errorCode: error.error?.code,
      };

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
      throw {
        success: false,
        message:
          'Error analyzing Api open IA, please review credentials, and keysfor the OpenIA API',
        error: error.message,
        errorStatus: error?.status,

        errorCode: error.error?.code,
      };
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
  let claims = [];

  const parsedLines = lines.map((entry) => {
    // Extraer las frases de la "claim"
    if (Array.isArray(entry) && entry.length > 1) {
      // Limpiar el prefijo de números seguidos de un punto en entry[1]
      const claimsRaw = entry[0]
        .split('-')
        .map((text) => text.replace(/^\d+\.\s*/, '').trim())
        .filter((text) => text.length > 0);
      console.log('claimsRaw', claimsRaw);

      if (claims.length <= 0) {
        // claims = claims + claimsRaw.join(' , ');
        claims.push(claimsRaw);
      } else {
        // claims = claims + '-' + claimsRaw.join(' , ');
        claims.push(claimsRaw);
      }

      const categoryType = entry[1]
        .split('-')
        .map((text) => text.replace(/^\d+\.\s*/, '').trim())
        .filter((text) => text.length > 0);
      const cleanedPhrase = entry[2]
        .split('-')
        .map((text) => text.replace(/^\d+\.\s*/, '').trim())
        .filter((text) => text.length > 0);

      return { claimsRaw, categoryType, cleanedPhrase };
    } else {
      // Manejo en caso de que entry no sea válido
      console.error('Entry inválido:', entry);
      return ''; // O algún valor por defecto apropiado
    }
  });
  // return parsedLines;
  // return RepetedClaims(claims);
  return RepetedClaims(parsedLines);

  return claims;
}

export async function RepetedClaims(texts) {
  const healthTweets = [];
  const seenTexts = new Set();

  // Función para normalizar texto
  function normalizeText(text) {
    console.log('normalizando', text);
    if (text) {
      return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Eliminar caracteres no alfanuméricos
        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
        .trim();
    }
  }

  async function areTweetsSimilarDeep(tweet1, tweet2) {
    // const prompt = `¿Los siguientes dos tweets tienen un significado similar?\nTweet 1: "${tweet1}"\nTweet 2: "${tweet2}"\nResponde "sí" o "no" pero sin puntos ni comas.`;
    const prompt = `¿Los siguientes dos tweets tienen un significado similar? tweet 1:"${tweet1}" teweet 2: "${tweet2}"\nResponde "sí" o "no", si se parecen , o son similares, pero sin puntos ni comas.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      const answer = response.choices[0].message.content.trim().toLowerCase();
      return answer === 'sí';
    } catch (error) {
      throw {
        success: false,
        message:
          'Error analyzing Api open IA, please review credentials, and keysfor the OpenIA API',
        error: error.message,
        errorStatus: error?.status,

        errorCode: error.error?.code,
      };

      // throw error;
    }
  }

  for (const tweetInfo of texts) {
    let tweet = tweetInfo.claimsRaw;

    try {
      const normalizedText = normalizeText(tweet?.join());

      if (seenTexts.has(normalizedText)) continue;

      let isDuplicate = false;

      const deepCheckPromises = healthTweets.map((existingTweet) => {
        if (existingTweet) {
          return areTweetsSimilarDeep(existingTweet.claimsRaw?.join(), tweet?.join());
        }
      });

      const results = await Promise.all(deepCheckPromises);

      if (results.some((result) => result)) {
        isDuplicate = true;
      }

      if (!isDuplicate) {
        healthTweets.push(tweetInfo);
        seenTexts.add(normalizedText);
      }
    } catch (error) {
      console.error('Error al analizar el tweet:', error);
      return error;
    }
  }
  return healthTweets;
}
