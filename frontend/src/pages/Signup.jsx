import React from 'react';
import SignupForm from '../components/auth/SignupForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Or <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">sign in to your existing account</Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
