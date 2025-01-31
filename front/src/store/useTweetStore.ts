import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
interface Tweet {
  _id: string;
  id: string;
  influencerId: string;
  created_at: string;
  text: string;
  claimsRaw: string;
  categoryType: string;
  cleanedPhrase: string;
  statusAnalysis: string;
  lines: string[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface TweetStore {
  tweets: Tweet[];
  getTweets: (influencerId: string) => Promise<void>;
  resetTweets: () => void;
}

export const useTweetStore = create<TweetStore>((set) => ({
  tweets: [],
  getTweets: async (influencerId) => {
    try {
      //http://localhost:5001/api/influencer/tweets/407395156
      const response = await axiosInstance.get(`/influencer/tweets/${influencerId}`);
      console.log('response', response.data);
      set({ tweets: response.data });
    } catch (error) {
      console.error('Error obteniendo tweets:', error);
    }
  },
  resetTweets: () => set({ tweets: [] }),
}));
