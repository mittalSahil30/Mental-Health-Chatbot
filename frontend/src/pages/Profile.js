import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('/profile', formData);
      updateUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      email: user.email || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="main-content fade-in">
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-secondary">{user.email}</p>
              {user.is_guest && (
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="text-accent-warning" size={16} />
                  <span className="text-accent-warning text-sm font-medium">Guest Account</span>
                </div>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="form-label">Username</label>
                <div className="p-3 bg-bg-secondary rounded-lg border border-border-color">
                  {user.username}
                </div>
              </div>

              <div>
                <label className="form-label">Email</label>
                <div className="p-3 bg-bg-secondary rounded-lg border border-border-color">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="form-label">Account Type</label>
                <div className="p-3 bg-bg-secondary rounded-lg border border-border-color">
                  {user.is_guest ? 'Guest Account' : 'Registered Account'}
                </div>
              </div>

              {!user.is_guest && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {user.is_guest && (
            <div className="mt-8 p-4 bg-accent-warning/10 border border-accent-warning/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="text-accent-warning mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-accent-warning mb-2">Upgrade Your Account</h3>
                  <p className="text-sm text-secondary mb-4">
                    Create a free account to access all features including personal journal, 
                    mental health assessments, and data persistence.
                  </p>
                  <div className="flex gap-3">
                    <a href="/register" className="btn btn-primary">
                      Create Account
                    </a>
                    <a href="/login" className="btn btn-secondary">
                      Sign In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;