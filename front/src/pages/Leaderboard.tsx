import React from 'react';

const mockInfluencers = [
  {
    name: 'Dr. Peter Attia',
    category: 'Medicine',
    trustScore: '94%',
    followers: '1.2M',
    claims: 203,
  },
  {
    name: 'Dr. Rhonda Patrick',
    category: 'Nutrition',
    trustScore: '91%',
    followers: '980K',
    claims: 156,
  },
  // Agrega más datos simulados aquí...
];

const Leaderboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Influencer Trust Leaderboard</h1>
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Influencer</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Trust Score</th>
            <th className="p-2 border">Followers</th>
            <th className="p-2 border">Verified Claims</th>
          </tr>
        </thead>
        <tbody>
          {mockInfluencers.map((influencer, index) => (
            <tr key={index} className="text-center border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{influencer.name}</td>
              <td className="p-2">{influencer.category}</td>
              <td className="p-2">{influencer.trustScore}</td>
              <td className="p-2">{influencer.followers}</td>
              <td className="p-2">{influencer.claims}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
