import { useEffect, useState } from 'react';
import ScientificJournal from '../components/ScientificJournal';
import { useTweetStore } from '../store/useTweetStore';
import { allInfluencerStore } from '../store/useInfluencerStore';

function ResearchTaskPage() {
  const { tweets, getTweets } = useTweetStore();
  const { influencers, getInfluencers } = allInfluencerStore();

  const [showResults, setShowResults] = useState(false);

  const [influencerName, setInfluencerName] = useState({ id: '', name: '' }); //-----------
  const [claimsToAnalyze, setClaimsToAnalyze] = useState(50);
  const handleStartResearch = () => {
    console.log(`Starting research for: ${influencerName.id}`);

    getTweets(influencerName.id);
  };

  useEffect(() => {
    getInfluencers();
  }, [getInfluencers]);

  const filteredInfluencers = influencers.filter((influencer) =>
    influencer.name.toLowerCase().includes(influencerName.name.toLowerCase())
  );

  return (
    <div className="p-6 bg-base-200 text-base-content rounded-lg container mx-auto pt-">
      <h2 className="text-2xl font-semibold mb-1">Research Tasks</h2>

      <div className="flex space-x-4 mb-6">
        <button className="btn btn-primary flex-1">Specific Influencer</button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Time Range</label>
        <div className="flex space-x-4">
          <button className="btn btn-outline">Last Week</button>
          <button className="btn btn-outline btn-active">Last Month</button>
          <button className="btn btn-outline">Last Year</button>
          <button className="btn btn-outline">All Time</button>
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
      <ScientificJournal />
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Notes for Research Assistant</label>
        <textarea
          placeholder="Add any specific instructions or focus areas..."
          className="textarea textarea-bordered w-full"
        ></textarea>
      </div>
      <button
        onClick={handleStartResearch}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start Research
      </button>

      <div>
        <h1>Influencers</h1>
        {tweets.map((tweet, index) => (
          <div key={index}>
            <p>{tweet.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResearchTaskPage;
