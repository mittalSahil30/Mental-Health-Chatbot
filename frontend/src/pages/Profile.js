import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Save, Edit3, Shield, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    setLoading(true);
    
    const result = await updateProfile(formData.username);
    
    if (result.success) {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({ username: user?.username || '' });
    setIsEditing(false);
  };

  return (
    <div className="profile-page fade-in">
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="gradient-text">Profile Settings</span>
          </h1>
        </div>
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Manage your account and personalize your experience to make the most of your mental health journey.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card scale-in">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg floating">
              <User className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold gradient-text">{user?.username}</h2>
            <p className="text-gray-600 text-lg">{user?.email}</p>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="mr-2" size={20} />
                Account Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="mr-2 text-gray-500" size={16} />
                    <span className="text-gray-700">{user?.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-input flex-1"
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="spinner mr-2"></div>
                        ) : (
                          <Save className="mr-2" size={16} />
                        )}
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{user?.username}</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="mr-2" size={20} />
                Privacy & Security
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="mr-2 text-green-500" size={16} />
                    <span className="text-sm font-medium text-green-800">
                      Data Encryption
                    </span>
                  </div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="mr-2 text-green-500" size={16} />
                    <span className="text-sm font-medium text-green-800">
                      Privacy First
                    </span>
                  </div>
                  <span className="text-xs text-green-600">Protected</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {user?.is_guest ? 'Guest' : 'Full'}
                  </div>
                  <div className="text-sm text-blue-800">Account Type</div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    Active
                  </div>
                  <div className="text-sm text-purple-800">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card text-center">
            <Heart className="mx-auto mb-4 text-pink-500" size={32} />
            <h3 className="text-lg font-semibold mb-2">Your Data</h3>
            <p className="text-gray-600 text-sm">
              All your journal entries, test results, and chat history are stored securely and privately
            </p>
          </div>

          <div className="card text-center">
            <Shield className="mx-auto mb-4 text-green-500" size={32} />
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600 text-sm">
              We use industry-standard encryption to protect your personal information
            </p>
          </div>
        </div>

        {user?.is_guest && (
          <div className="mt-8 card bg-yellow-50 border-yellow-200">
            <div className="text-center">
              <Shield className="mx-auto mb-4 text-yellow-600" size={48} />
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Upgrade Your Account
              </h3>
              <p className="text-yellow-700 mb-6">
                You're currently using a guest account. Create a full account to access all features 
                including journal, mental health tests, mindfulness exercises, and more.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/register" className="btn btn-primary">
                  Create Account
                </a>
                <a href="/login" className="btn btn-secondary">
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;