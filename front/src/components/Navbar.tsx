import { Link } from 'react-router-dom';
import { Shield, LogOut, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8 w-1/2 ">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg  flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold   text-transparent bg-clip-text bg-gradient-to-r from-green-400  to-sky-600">
                VerifyInfluencers
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/research-tasks"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h1 className="text-lg ">research-tasks</h1>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/leaderboard"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h1 className="text-lg ">leaderboard</h1>
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/influencer/:1"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h1 className="text-lg ">influencer</h1>
            </Link>
          </div>
          {true && (
            <>
              {false && (
                <Link to={'/profile'} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}

              <button className="flex gap-2 items-center" onClick={() => alert('logout')}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
