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
    <div className="form-container scale-in">
      <div className="text-center mb-10">
        <div className="floating">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="text-white" size={40} />
          </div>
        </div>
        <h1 className="form-title">Welcome Back</h1>
        <p className="form-subtitle">Sign in to your account to continue your mental health journey and access personalized features</p>
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

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
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
            <Link to="/register" className="btn btn-secondary flex-1">
              Sign Up
            </Link>
          </div>
          
          <div className="text-center">
            <span className="text-gray-600">or </span>
            <button
              onClick={handleGuestLogin}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
              disabled={loading}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;