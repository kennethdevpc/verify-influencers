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
