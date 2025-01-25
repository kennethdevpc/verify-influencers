import { useEffect, useState } from 'react';
import ScientificJournal from '../components/ScientificJournal';
import { allInfluencerStore } from '../store/useAuthStore';

function ResearchTaskPage() {
  const { influencers, getInfluencers } = allInfluencerStore();
  useEffect(() => {
    getInfluencers();
  }, [getInfluencers]);

  const [influencerName, setInfluencerName] = useState('');
  const [claimsToAnalyze, setClaimsToAnalyze] = useState(50);
  const handleStartResearch = () => {
    console.log(`Starting research for: ${influencerName}`);
  };
  return (
    <div className="p-6 bg-base-200 text-base-content rounded-lg container mx-auto pt-">
      <h2 className="text-2xl font-semibold mb-1">Research Tasks</h2>

      <div className="flex space-x-4 mb-6">
        <button className="btn btn-primary flex-1">Specific Influencer</button>
        <button className="btn btn-secondary flex-1">Discover New</button>
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
          value={influencerName}
          onChange={(e) => setInfluencerName(e.target.value)}
        />
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
        {influencers.map((influencer, index) => (
          <div key={index}>
            <h2>{influencer.name}</h2>
            <img src={influencer.profileImage} alt={influencer.name} />
            <p>Followers: {influencer.followers}</p>
            <p>Verified Claims: {influencer.verifiedClaims}</p>
            <p>Score: {influencer.score ?? 'N/A'}</p>
            <h3>Details:</h3>
            {influencer.details.map((detail, detailIndex) => (
              <div key={detailIndex}>
                <p>{detail.description}</p>
                <img src={detail.profileImageUrl} alt={detail.name} />
                <p>Followers: {detail.followers}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResearchTaskPage;
