
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/solid';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register, enterAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ username, password });
      } else {
        await register({ 
          username, 
          email, 
          password, 
          full_name: fullName 
        });
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-dark dark:to-neutral">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-neutral rounded-2xl shadow-2xl">
        <div className="text-center">
            <SparklesIcon className="h-12 w-12 text-primary mx-auto" />
            <h2 className="mt-4 text-3xl font-extrabold text-neutral dark:text-white">
                Welcome to SereneMind AI
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-light dark:bg-dark text-neutral dark:text-light focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Username"
          />
          
          {!isLogin && (
            <>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-light dark:bg-dark text-neutral dark:text-light focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Full Name (optional)"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-light dark:bg-dark text-neutral dark:text-light focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Email address"
              />
            </>
          )}
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-light dark:bg-dark text-neutral dark:text-light focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Password"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-sm text-primary hover:text-primary/80">
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">Or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <button
          onClick={() => { enterAsGuest(); navigate('/'); }}
          className="w-full py-3 px-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        >
          Continue as Guest
        </button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Guest mode offers privacy for the chatbot, but other features like journaling require an account.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
