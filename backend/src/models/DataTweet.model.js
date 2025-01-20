import mongoose from 'mongoose';

const DataTweetSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: false,
      unique: false,
    },
    InfluencerId: {
      type: String,
      required: false,
      unique: false,
    },
    text: {
      type: String,
      required: false,
    },
    created_at: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);
//------el modelo se crea en singular siempre y con la primera letra mayuscula, por ejemplo Influencer para Influencers
const DataTweet = mongoose.model('DataTweet', DataTweetSchema);

export default DataTweet;
