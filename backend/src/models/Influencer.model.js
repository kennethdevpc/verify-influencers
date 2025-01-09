import mongoose from 'mongoose';

const InfluencerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: false,
      unique: false,
    },
    name: {
      type: String,
      required: false,
      unique: false,
    },
    username: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
//------el modelo se crea en singular siempre y con la primera letra mayuscula, por ejemplo Influencer para Influencers
const Influencer = mongoose.model('Influencer', InfluencerSchema);

export default Influencer;
