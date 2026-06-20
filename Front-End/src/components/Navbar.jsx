import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, ShoppingBagIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchTerm(queryParams.get('search') || '');
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="text-3xl font-bold text-vinted">Ρουχάδικο</Link>
        <div className="flex-1 max-w-2xl px-8 hidden md:flex relative">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-vinted"
              placeholder="Αναζήτηση..."
            />
            <button type="submit" className="absolute left-3 top-2.5">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </button>
          </form>
        </div>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/my-orders" className="text-gray-600 hover:text-vinted flex items-center gap-1 text-sm font-medium">
                <ClipboardDocumentListIcon className="h-6 w-6" />
                <span className="hidden sm:inline">Οι Παραγγελίες μου</span>
              </Link>
              <Link to="/cart" className="text-gray-600 hover:text-vinted"><ShoppingBagIcon className="h-6 w-6" /></Link>
              <button onClick={() => logout(navigate)} className="text-red-500 hover:text-red-700 font-medium text-sm">Αποσύνδεση</button>
            </>
          ) : (
            <>
              <Link to="/cart" className="text-gray-600 hover:text-vinted"><ShoppingBagIcon className="h-6 w-6" /></Link>
              <Link to="/login" className="text-vinted border border-vinted px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-50 transition">Σύνδεση</Link>
              <Link to="/register" className="bg-vinted text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-vintedHover transition">Εγγραφή</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;