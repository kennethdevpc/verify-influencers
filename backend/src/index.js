import express from 'express';
import dotenv from 'dotenv'; //----dotenv
import cors from 'cors';
import api from './routes/ api.route.js';

import { TWITTER_BEARER_TOKEN, YOUTUBE_API_KEY } from './config/apiKeys.js';
import { connectDB } from './lib/db.js'; //---importo la conexion a la base de datos
import mongoose from 'mongoose';

//--configuracion
dotenv.config(); //------dotenv.config();
const PORT = process.env.PORT || 3000; //----uso de dotenv
const app = express();

app.use(cors());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

//--rutas
app.get('/', (req, res) => {
  res.send('hola');
});
app.use('/api', api);
app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
  connectDB(); //------conecto la base de datos
});

// app.listen(PORT, async () => {
//   console.log('Server is running on port ', PORT);

//   try {
//     await connectDB(); // Espera a que la base de datos se conecte
//     console.log('Conexión a MongoDB exitosa.');

//     // Vaciar toda la base de datos
//     if (mongoose.connection.db) {
//       await mongoose.connection.db.dropDatabase(); // Resetea la base de datos
//       console.log('Base de datos reseteada correctamente.');
//     } else {
//       console.error('Conexión a la base de datos no establecida.');
//     }
//   } catch (error) {
//     console.error('Error al resetear la base de datos:', error);
//   }
// });
