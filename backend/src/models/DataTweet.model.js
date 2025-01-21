import mongoose from 'mongoose';

const DataTweetSchema = new mongoose.Schema(
  {
    id: {
      //---Id del tweet
      type: String,
      required: true,
      unique: true,
    },
    influencerId: {
      type: String,
      required: false,
      unique: false,
    },
    created_at: {
      type: Date,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    claimsRaw: {
      type: String,
      required: false,
    },
    categoryType: {
      type: String,
      required: false,
    },
    cleanedPhrase: {
      type: String,
      required: false,
    },
    statusAnalysis: {
      type: String,
      required: false,
    },
    lines: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);
//------el modelo se crea en singular siempre y con la primera letra mayuscula, por ejemplo Influencer para Influencers
const DataTweet = mongoose.model('DataTweet', DataTweetSchema);

export default DataTweet;
