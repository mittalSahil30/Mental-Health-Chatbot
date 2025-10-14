
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  }

  return (
    <div className="p-6 bg-white dark:bg-neutral rounded-lg shadow-md h-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="flex items-center space-x-6 mb-8">
        <UserCircleIcon className="h-24 w-24 text-gray-300 dark:text-gray-600"/>
        <div>
            <h2 className="text-3xl font-bold">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 bg-light dark:bg-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
            </div>
             <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 bg-light dark:bg-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
            </div>
        </div>

        <div className="mt-6 flex items-center space-x-4">
            {isEditing ? (
                <>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Save Changes</button>
                    <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300">Cancel</button>
                </>
            ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90">Edit Profile</button>
            )}
        </div>
         {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;
