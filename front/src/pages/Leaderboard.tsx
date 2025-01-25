import { useEffect } from 'react';
import { allInfluencerStore } from '../store/useAuthStore';

const Leaderboard = () => {
  const { influencers, getInfluencers } = allInfluencerStore();
  useEffect(() => {
    getInfluencers();
  }, [getInfluencers]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Influencer Trust Leaderboard</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Time Range</label>
        <div className="flex md:space-x-4  space-x-2 md:flex-row  flex-wrap ">
          <button className="btn btn-sm btn-outline rounded-lg">All</button>
          <button className="btn btn-sm btn-outline btn-active">Nutrition</button>
          <button className="btn btn-sm btn-outline">Medicine</button>
          <button className="btn btn-sm btn-outline">Mental_Health</button>
          <button className="btn btn-sm btn-outline">Fitness</button>
          <button className="btn btn-sm btn-outline">Exercise</button>
        </div>
      </div>
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="bg-green-500 text-gray-950">
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Influencer</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border hidden md:table-cell">Trust Score</th>
            <th className="p-2 border hidden md:table-cell">Followers</th>
            <th className="p-2 border ">Verified Claims</th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((influencer, index) => {
            // Obtén la categoría principal (si existe)
            const mainCategory = influencer.filteredCategories
              ? Object.keys(influencer.filteredCategories)[0] || 'N/A'
              : 'N/A';

            return (
              <tr key={index} className="text-center border-t">
                <td className="p-2">{index + 1}</td>

                <td className="p-2 flex items-center gap-2">
                  <img
                    src={influencer.profileImage}
                    alt={influencer.name}
                    className="rounded-full w-10 h-10"
                  />{' '}
                  {influencer.name}
                </td>

                <td className="p-2">{mainCategory}</td>
                <td className="p-2 hidden md:table-cell ">{influencer.score ?? 'N/A'}</td>
                <td className="p-2 hidden md:table-cell">{influencer.followers}</td>
                <td className="p-2">{influencer.verifiedClaims}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
