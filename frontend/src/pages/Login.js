import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, createGuestUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    
    const result = await createGuestUser();
    
    if (result.success) {
      toast.success('Welcome as a guest! You can use the chatbot.');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="text-center mb-8">
        <Heart className="mx-auto mb-4" size={48} color="#667eea" />
        <h1 className="form-title">Welcome Back</h1>
        <p className="form-subtitle">Sign in to your account to continue your mental health journey</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input pr-12"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner mr-2"></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue as</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleGuestLogin}
        className="btn btn-secondary w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="spinner mr-2"></div>
            Creating Guest Account...
          </>
        ) : (
          'Continue as Guest'
        )}
      </button>

      <div className="form-footer">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-800">
          Sign up here
        </Link>
      </div>
    </div>
  );
};

export default Login;