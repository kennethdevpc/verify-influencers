import { useParams } from 'react-router-dom';
import { allInfluencerStore } from '../store/useInfluencerStore';
import { useEffect } from 'react';
import { useTweetStore } from '../store/useTweetStore';
import ReturnDashboard from '../components/ReturnDashboard';

const Influencer = () => {
  const { id } = useParams<{ id: string }>();
  const { getInfluencerById, influencer } = allInfluencerStore();
  const { tweets, getTweets } = useTweetStore();

  console.log('............', Object.keys(influencer.filteredCategories));

  useEffect(() => {
    // Si el influencer ya está en el estado global, no volver a hacer la petición
    if (id && (!influencer || influencer?.details[0]?.id !== id)) {
      getInfluencerById(id);
      getTweets(id);
    }
  }, [id, getInfluencerById, influencer]); // Se ejecuta solo cuando cambia el ID

  if (!influencer) {
    return <p>Cargando...</p>; // Evitar errores si los datos aún no han llegado
  }
  const formatNumber = (num: string) => {
    return new Intl.NumberFormat('en', { notation: 'compact' }).format(parseInt(num));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <ReturnDashboard route="/leaderboard" title="Details" backRoute="Leaderboard" />

      {/* Header */}
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-6">
          <img
            src={influencer.profileImage}
            alt={influencer.name}
            className="w-24 h-24 rounded-full border-4 border-gray-700"
          />
          <div>
            <h1 className="text-3xl font-bold">{influencer.name}</h1>
            <p className="text-gray-400">{influencer.details[0]?.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.keys(influencer.filteredCategories).map((category, index) => (
                <span key={index} className="bg-gray-700 text-sm px-3 py-1 rounded-full">
                  {category} - {influencer.filteredCategories[category]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-green-400 text-2xl font-bold">{influencer.score}%</p>
            <p className="text-gray-400 text-sm">Trust Score</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-green-400 text-2xl font-bold">@{influencer.details[0]?.username}</p>
            <p className="text-gray-400 text-sm">Yearly Revenue</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-green-400 text-2xl font-bold">
              {formatNumber(influencer.followers)}+
            </p>
            <p className="text-gray-400 text-sm">Followers</p>
          </div>
        </div>
      </div>

      {/* Análisis de Claims */}
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 mt-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Claims Analysis {influencer.verifiedClaims}</h2>

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
                  {tweets.map((tweet, index) => (
                    <tr key={tweet._id} className="border-b hover:bg-gray-700">
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
    </div>
  );
  return (
    // <div className="p-8">
    <div className="p-6 bg-base-200 text-base-content rounded-lg container mx-auto pt-">
      <div className="mb-6 flex flex-row items-center">
        <img src={influencer.profileImage} alt={influencer.name} className="rounded-full   mb-4" />
        <h1 className="text-5xl font-bold ">{influencer.name}</h1>
      </div>
      <div>
        <p>verifiedClaims: {influencer.verifiedClaims}</p>
        <p>Followers: {influencer.followers}</p>
        <p>Trust Score: {influencer.score}</p>
        <h2 className="text-xl font-semibold mb-4">Claims</h2>
        <p>Category: </p>

        <ul>
          influencer.verifiedClaims
          {Object.keys(influencer.filteredCategories).map((category, index) => (
            <li key={index} className="mb-4 p-4 border rounded-md">
              <p>{category}</p>
            </li>
          ))}
          {/* {influencer.verifiedClaims.map((claim, index) => (
            <li key={index} className="mb-4 p-4 border rounded">
              <p>{claim.text}</p>
              <p>Status: {claim.status}</p>
              <p>Confidence Score: {claim.score}</p>
            </li>
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default Influencer;
