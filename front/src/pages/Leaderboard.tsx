import { useEffect, useState } from 'react';
import { allInfluencerStore } from '../store/useInfluencerStore';
import { ArrowUp10 } from 'lucide-react';

const Leaderboard = () => {
  const { influencers, getInfluencers } = allInfluencerStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // Estado para el orden
  const [filterInfluencers, setFilterInfluencers] = useState(influencers);

  useEffect(() => {
    getInfluencers();
  }, [getInfluencers]);

  //---influencer filter

  useEffect(() => {
    // Filtrado por categoría
    const filtered = influencers.filter((influencer) => {
      if (selectedCategory === 'All') {
        return true; // Mostrar todos los influencers si la categoría es "All"
      } else {
        // Verificar si la categoría seleccionada está en las filteredCategories del influencer
        return Object.keys(influencer.filteredCategories).includes(selectedCategory);
      }
    });

    // Ordenamiento por score
    const sorted = [...filtered].sort((a, b) => {
      const scoreA = a.score || 0; // Si el score es null, se considera 0
      const scoreB = b.score || 0; // Si el score es null, se considera 0
      return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB; // Ordenar por score
    });

    setFilterInfluencers(sorted); // Actualizar influencers filtrados y ordenados
  }, [selectedCategory, influencers, sortOrder]);
  //---category filter

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Función para alternar el orden (ascendente o descendente)
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const categories = ['All', 'Nutrition', 'Mental_Health', 'Fitness', 'Exercise'];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Influencer Trust Leaderboard</h1>
      <label className="block text-sm font-medium mb-2">Category </label>

      <div className="mb-4 flex flex-col md:flex-row justify-between">
        <div className="flex md:space-x-4  space-x-2 md:flex-row  flex-wrap ">
          {categories.map((category) => (
            <button
              className={
                selectedCategory === `${category}`
                  ? 'btn btn-sm btn-outline btn-active'
                  : 'btn btn-sm btn-outline'
              }
              onClick={() => handleCategoryChange(`${category}`)}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Botón para ordenar por score */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-lg mb-4"
        >
          <ArrowUp10 className="size-5" />
          {sortOrder === 'desc' ? 'Order High to Low' : 'Order Low to High'}
        </button>
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
          {filterInfluencers.map((influencer, index) => {
            // Obtén la categoría principal (si existe)
            const mainCategory = influencer.filteredCategories
              ? Object.keys(influencer.filteredCategories)
              : ['Search information'];

            console.log('---------------', Object.keys(influencer.filteredCategories));
            console.log('---------------', influencer.name);

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

                <td className="p-2">
                  <>
                    {mainCategory.map((e) => (
                      <span key={e} className="mr-2  text-blue-500">
                        {e} ,
                      </span>
                    ))}
                  </>
                </td>
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
