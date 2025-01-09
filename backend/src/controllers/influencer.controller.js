import { fetchTwitterData } from '../services/influencer.service.js';

export const analyzeInfluencer = async (req, res) => {
  console.log(req.body);
  res.send('analyzeInfluencer');
};

export const getInfluencerDetails = async (req, res) => {
  res.send('getInfluencerDetails');
};

// Controlador para manejar la búsqueda de datos de un influencer
export const getInfluencerData = async (req, res) => {
  const { name } = req.params;
  res.send('getInfluencerData', name);
  try {
    // Lógica para obtener datos desde Twitter (o cualquier API)
    const data = await fetchTwitterData(name);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching influencer data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching influencer data',
    });
  }
};
