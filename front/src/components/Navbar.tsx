import { Link } from 'react-router-dom';
import { Shield, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-8 w-1/2">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-sky-600">
                VerifyInfluencers
              </h1>
            </Link>
          </div>
          {/* Menú para pantallas grandes (md y superiores) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/research-tasks"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h1 className="text-lg">research-tasks</h1>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h1 className="text-lg">leaderboard</h1>
            </Link>
            <Link
              to="/influencer/:1"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h1 className="text-lg">influencer</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Menú hamburguesa para pantallas pequeñas (sm) */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>

            {/* Botón de Sign Out (siempre visible) */}
            <div className="flex items-center gap-8">
              {true && (
                <>
                  {false && (
                    <Link to={'/profile'} className={`btn btn-sm gap-2`}>
                      <User className="size-5" />
                      <span className="hidden sm:inline">Login</span>
                    </Link>
                  )}
                  <button className="flex gap-2 items-center" onClick={() => alert('logout')}>
                    <LogOut className="size-5 mx-0" />
                    <span className="hidden sm:inline  ">Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menú desplegable para pantallas pequeñas (sm) */}
        {isMenuOpen && (
          <div className="flex flex-col w-48 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-lg shadow-xl absolute right-4 p-4 mt-2 space-y-2  md:hidden">
            <Link
              to="/research-tasks"
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/20 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <h1 className="text-lg font-medium">research-tasks</h1>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/20 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <h1 className="text-lg font-medium">leaderboard</h1>
            </Link>
            <Link
              to="/influencer/:1"
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/20 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <h1 className="text-lg font-medium">influencer</h1>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar;
