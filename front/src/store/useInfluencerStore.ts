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
  influencer: InfluencerData;
  influencers: InfluencerData[]; // Cambia details por influencers
  getInfluencers: () => Promise<void>;
  getInfluencerById: (id: string) => Promise<void>;
}

export const allInfluencerStore = create<ProfileInfluencerStore>((set) => ({
  influencers: [],
  influencer: {
    details: [],
    name: '',
    profileImage: '',
    filteredCategories: {},
    score: null,
    followers: '',
    verifiedClaims: 0,
  },

  getInfluencers: async () => {
    try {
      const res = await axiosInstance.get('/influencer/influencers');
      set({ influencers: res.data });
    } catch (error) {
      console.error(error);
    }
  },
  getInfluencerById: async (id: string) => {
    try {
      console.log('ejecutnado el stoere');
      const res = await axiosInstance.get(`/influencer/details/${id}`);
      set({ influencer: res.data });
    } catch (error) {
      console.error(error);
    }
  },
}));
