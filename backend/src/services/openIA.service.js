import OpenAI from 'openai'; // Nueva versión del SDK
import dotenv from 'dotenv'; //----dotenv
dotenv.config();
// Configuración de OpenAI con tu clave de API
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});
// Función para filtrar tweets relacionados con la salud usando GPT-4
export async function filterHealthTweet(tweets) {
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

export async function extractClaimsFromTweets(tweets) {
  const claims = [];
  let extractedClaimsxxx = [];
  let extractedClaimsxxx2 = [];
  // let tweetsA = [];
  // tweetsA = filterHealthTweets(tweets);
  for (const tweet of tweets) {
    // Pedirle a GPT-4 que extraiga afirmaciones
    // const prompt = `Extrae las afirmaciones de salud del siguiente tweet: "${tweet.text}". Divide las afirmaciones en frases cortas, solo lo referente a la salud, de manera mas organizada.`;
    const prompt = `Extrae solo las afirmaciónes sobre salud de este tweet, que tu consideres relevantes, pero no repitas o hagas afirmaciones sin sentido: '${tweet.text}'. separalas con un "-", si no hay una frase no la agregues y tampoco coloques afirmaciones en blanco como afirmaciones`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      // extractedClaimsxxx.push(response.choices[0].message.content.trim().split('-'));

      const extractedClaims = response.choices[0].message.content.trim().split('-');
      let claimUser = [];
      // // Para cada afirmación extraída, vamos a categorizarla y asignarle un nivel de confianza
      for (let claim of extractedClaims) {
        if (claim.length < 1) {
          console.log('el claim', claim);
          continue; // Saltar al siguiente claim
        }
        //   // Categorizar la afirmación
        const categoryResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `¿A qué categoría pertenece la siguiente afirmación: "${claim}"? Las categorías disponibles son: Nutrición, Medicina, Salud Mental, Ejercicio. Responde solo con la categoría correspondiente.`,
            },
          ],
        });
        // extractedClaimsxxx2.push(categoryResponse.choices[0].message.content.trim());
        const category = categoryResponse.choices[0].message.content.trim();

        // Asignar un nivel de confianza
        const confidenceResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `¿Cuánta confianza tienes en esta afirmación: "${claim}"? Responde con un puntaje entre 0 y 100 0 significa bajo, 100 mas alto, porfavor dame un dato numerico primero y luego la informacion que encuentras (solo 30 palabras maximo), por ejemplo:  80-La prevención de enfermedades a través de hábitos saludables, chequeos médicos regulares y vacunaciones es fundamental para mantener una buena salud `,
            },
          ],
        });
        const confidenceScore = confidenceResponse.choices[0].message.content.trim().split('-', 2);

        // Agregar la afirmación con la categoría y el nivel de confianza
        claimUser.push({
          claim: claim,
          category: category,
          confidenceScore: confidenceScore,
        });
      }
      claims.push({ tweet: tweet.text, claims: claimUser });
    } catch (error) {
      console.error('Error al procesar el tweet:', error);
      return error;
    }
  }
  return claims;
}

export async function filterHealthTweets(tweets) {
  const healthTweets = [];
  const seenTexts = new Set();

  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') //elimino caracteres que no sean letras y _
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isTextSimilarSimple(text1, text2) {
    const words1 = new Set(text1.split(' '));
    const words2 = new Set(text2.split(' '));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const smallerSetSize = Math.min(words1.size, words2.size);
    return intersection.size / smallerSetSize > 0.7; // Umbral simple de similitud
  }

  async function areTweetsSimilarDeep(tweet1, tweet2) {
    const prompt = `¿Los siguientes dos tweets tienen un significado similar?\nTweet 1: "${tweet1.text}"\nTweet 2: "${tweet2.text}"\nResponde "sí" o "no" pero sin puntos ni comas.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      const answer = response.choices[0].message.content.trim().toLowerCase();
      return answer === 'sí';
    } catch (error) {
      console.error('Error al analizar la similitud entre tweets:', error);
      return false;
    }
  }

  for (const tweet of tweets) {
    const prompt = `¿El siguiente tweet trata sobre salud? Responde "sí" o "no" pero sin puntos ni comas.\nTweet: "${tweet.text}"`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      const answer = response.choices[0].message.content.trim().toLowerCase();
      if (answer === 'sí') {
        const normalizedText = normalizeText(tweet.text);

        // Prefiltrado por normalización
        if (seenTexts.has(normalizedText)) continue;

        let isDuplicate = false;

        // Prefiltrado por palabras similares
        for (const existingTweet of healthTweets) {
          const normalizedExistingText = normalizeText(existingTweet.text);
          if (isTextSimilarSimple(normalizedText, normalizedExistingText)) {
            isDuplicate = true;
            break;
          }
        }

        // Si pasa el prefiltrado, usa el modelo para comparación profunda
        if (!isDuplicate) {
          for (const existingTweet of healthTweets) {
            if (await areTweetsSimilarDeep(existingTweet, tweet)) {
              isDuplicate = true;
              break;
            }
          }
        }

        if (!isDuplicate) {
          healthTweets.push(tweet);
          seenTexts.add(normalizedText);
        }
      }
    } catch (error) {
      console.error('Error al analizar el tweet:', error);
      return error;
    }
  }

  return healthTweets;
}
