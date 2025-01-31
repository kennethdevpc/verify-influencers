import { useEffect, useState } from 'react';
import { useTweetStore } from '../store/useTweetStore';
import { allInfluencerStore } from '../store/useInfluencerStore';
import ReturnDashboard from '../components/ReturnDashboard';

function ResearchTaskPage() {
  const { tweets, getTweets, resetTweets } = useTweetStore();
  const { influencers, getInfluencers } = allInfluencerStore();

  const [selectedDateRange, setSelectedDateRange] = useState<'week' | 'month' | 'year' | 'all'>(
    'all'
  );

  const [showResults, setShowResults] = useState(false);
  const [influencerName, setInfluencerName] = useState({ id: '', name: '' }); //-----------
  const [claimsToAnalyze, setClaimsToAnalyze] = useState(50);

  const handleStartResearch = () => {
    getTweets(influencerName.id);
  };

  useEffect(() => {
    getInfluencers();
  }, [getInfluencers]);

  useEffect(() => {
    resetTweets();
  }, []);

  const filteredInfluencers = influencers.filter((influencer) =>
    influencer.name.toLowerCase().includes(influencerName.name.toLowerCase())
  );
  const getDateRange = (range: 'week' | 'month' | 'year' | 'all') => {
    const now = new Date();
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      case 'all':
        return new Date(0); // Fecha mínima (1 de enero de 1970)
      default:
        return new Date(0);
    }
  };
  const filteredTweets = tweets.filter((tweet) => {
    const tweetDate = new Date(tweet.created_at);
    const startDate = getDateRange(selectedDateRange);
    return tweetDate >= startDate;
  });

  return (
    <div className="p-6 bg-base-200 text-base-content rounded-lg container mx-auto pt-">
      <ReturnDashboard route="/" title="Home" backRoute="Dashboard" />

      <h2 className="text-2xl font-semibold mb-1">Research Tasks</h2>

      <div className="flex space-x-4 mb-6">
        <button onClick={handleStartResearch} className="btn btn-primary flex-1">
          Search Influencer
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Time Range</label>
        <div className="mb-4">
          <div className="flex space-x-4">
            <button
              className={`btn btn-outline ${selectedDateRange === 'week' ? 'btn-active' : ''}`}
              onClick={() => setSelectedDateRange('week')}
            >
              Last Week
            </button>
            <button
              className={`btn btn-outline ${selectedDateRange === 'month' ? 'btn-active' : ''}`}
              onClick={() => setSelectedDateRange('month')}
            >
              Last Month
            </button>
            <button
              className={`btn btn-outline ${selectedDateRange === 'year' ? 'btn-active' : ''}`}
              onClick={() => setSelectedDateRange('year')}
            >
              Last Year
            </button>
            <button
              className={`btn btn-outline ${selectedDateRange === 'all' ? 'btn-active' : ''}`}
              onClick={() => setSelectedDateRange('all')}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Influencer Name</label>
        <input
          type="text"
          placeholder="Enter influencer name"
          className="input input-bordered w-full"
          value={influencerName.name}
          onChange={(e) => {
            setShowResults(true); // Mostrar la lista de resultados
            setInfluencerName({ id: '', name: e.target.value });
          }}
        />
        {/* Lista de resultados */}
        {showResults && influencerName.name && (
          <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-48 overflow-y-auto">
            {filteredInfluencers.map((influencer) => (
              <div
                key={influencer.details[0].id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setShowResults(false); // Ocultar la lista de resultados
                  setInfluencerName({ id: influencer.details[0].id, name: influencer.name }); // Rellenar el input con el nombre seleccionado
                }}
              >
                <p className="text-sm font-medium">{influencer.name}</p>
                <p className="text-xs text-gray-500">ID: {influencer.details[0].id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Claims to Analyze Per Influencer</label>
        <input
          type="number"
          placeholder="50"
          className="input input-bordered w-full"
          value={claimsToAnalyze}
          onChange={(e) => setClaimsToAnalyze(Number(e.target.value))}
        />
      </div>

      <div>
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="p-3 text-left border">No.</th>
                  <th className="p-3 text-left border">Tweet Text</th>
                  <th className="p-3 text-left border">Category</th>
                  <th className="p-3 text-left border">Analysis Status</th>
                  <th className="p-3 text-left border">Cleaned Phrase</th>
                </tr>
              </thead>
              <tbody>
                {filteredTweets.slice(0, claimsToAnalyze).map((tweet, index) => (
                  <tr key={tweet._id} className="border-b hover:bg-slate-500">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{tweet.text}</td>
                    <td className="p-3 border">{tweet.categoryType}</td>
                    <td className="p-3 border">{tweet.statusAnalysis}</td>
                    <td className="p-3 border">{tweet.cleanedPhrase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResearchTaskPage;
