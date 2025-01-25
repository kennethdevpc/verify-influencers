import { MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function ReturnDashboard() {
  return (
    <div className="container mx-auto flex items-center gap-4 mb-2 pt-24">
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
        <div className="size-9 rounded-lg  flex items-center justify-center">
          <MoveLeft className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="    text-transparent bg-clip-text bg-gradient-to-r from-green-400  to-emerald-600">
          Back to Dashboard
        </h3>
      </Link>
      <h2 className="text-2xl font-semibold ">Research Tasks</h2>
    </div>
  );
}

export default ReturnDashboard;
