const influencer = {
  name: 'Andrew Huberman',
  category: 'Neuroscience',
  trustScore: '89%',
  followers: '4.2M',
  claims: [
    {
      text: 'Viewing sunlight within 30-60 minutes of waking enhances cortisol release.',
      status: 'Verified',
      score: '92%',
    },
    {
      text: 'Non-sleep deep rest (NSDR) protocols can accelerate recovery.',
      status: 'Verified',
      score: '88%',
    },
  ],
};

const Influencer = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{influencer.name}</h1>
        <p>Category: {influencer.category}</p>
        <p>Followers: {influencer.followers}</p>
        <p>Trust Score: {influencer.trustScore}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Claims</h2>
        <ul>
          {influencer.claims.map((claim, index) => (
            <li key={index} className="mb-4 p-4 border rounded">
              <p>{claim.text}</p>
              <p>Status: {claim.status}</p>
              <p>Confidence Score: {claim.score}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Influencer;
