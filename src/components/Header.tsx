import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/firebase';
import { Menu, X, Search } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      navigate('/');
      setIsMenuOpen(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight hover:text-teal-400 transition-colors">
          Sankalp Dawada
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop search */}
        <div className="hidden md:flex items-center bg-slate-800 rounded-lg overflow-hidden px-2 w-64 lg:w-80">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder="Search projects and certificates..."
              className="bg-transparent py-2 px-2 flex-grow focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="p-2 text-slate-400 hover:text-white">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/#about" className="hover:text-teal-400 transition-colors">
            About
          </Link>
          <Link to="/#projects" className="hover:text-teal-400 transition-colors">
            Projects
          </Link>
          <Link to="/#certificates" className="hover:text-teal-400 transition-colors">Certification</Link>
          {isAuthenticated ? (
            <>
              {/* <Link to="/add-project" className="hover:text-teal-400 transition-colors">
                Add Project
              </Link>
              <Link to="/add-certificates" className="hover:text-teal-400 transition-colors">Add Certificates</Link> */}
              <button
                onClick={handleLogout}
                className="hover:text-teal-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-teal-400 transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="w-full md:hidden mt-4">
            <form 
              onSubmit={handleSearch} 
              className="bg-slate-800 rounded-lg overflow-hidden px-2 mb-4 flex"
            >
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-transparent py-2 px-2 flex-grow focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-2 text-slate-400 hover:text-white">
                <Search size={18} />
              </button>
            </form>
            
            <ul className="flex flex-col space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 hover:text-teal-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/#projects" 
                  className="block py-2 hover:text-teal-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      to="/add-project" 
                      className="block py-2 hover:text-teal-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Project
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 hover:text-teal-400 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link 
                    to="/login" 
                    className="block py-2 hover:text-teal-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;