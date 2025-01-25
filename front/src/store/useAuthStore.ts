import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
interface Category {
  [key: string]: number;
}

interface ProfileDetail {
  _id: string;
  id: string;
  name: string;
  username: string;
  profileImageUrl: string;
  description: string;
  followers: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface InfluencerData {
  details: ProfileDetail[];
  name: string;
  profileImage: string;
  filteredCategories: Category;
  score: number | null;
  followers: string;
  verifiedClaims: number;
}

interface ProfileInfluencerStore {
  influencers: InfluencerData[]; // Cambia details por influencers
  getInfluencers: () => Promise<void>;
}

export const allInfluencerStore = create<ProfileInfluencerStore>((set, get) => ({
  influencers: [],

  getInfluencers: async () => {
    try {
      const res = await axiosInstance.get('/influencer/influencers');
      console.log('aqui-------');
      set({ influencers: res.data });
    } catch (error) {
      console.error(error);
    }
  },
}));
