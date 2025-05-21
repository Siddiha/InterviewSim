import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">InterviewSim</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/questions"
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  Questions
                </Link>
                <Link
                  to="/profile"
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-secondary-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
