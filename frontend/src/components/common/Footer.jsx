import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-secondary-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-secondary-500 text-sm">
            © 2024 InterviewSim. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="text-secondary-500 hover:text-secondary-900 text-sm">
              About
            </Link>
            <Link to="/privacy" className="text-secondary-500 hover:text-secondary-900 text-sm">
              Privacy
            </Link>
            <Link to="/terms" className="text-secondary-500 hover:text-secondary-900 text-sm">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
