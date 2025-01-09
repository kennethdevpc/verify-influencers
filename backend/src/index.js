import express from 'express';
import dotenv from 'dotenv'; //----dotenv
import cors from 'cors';
import api from './routes/ api.route.js';

import { TWITTER_BEARER_TOKEN, YOUTUBE_API_KEY } from './config/apiKeys.js';
import { connectDB } from './lib/db.js'; //---importo la conexion a la base de datos

//--configuracion
dotenv.config(); //------dotenv.config();
const PORT = process.env.PORT || 3000; //----uso de dotenv
const app = express();

app.use(cors());
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
