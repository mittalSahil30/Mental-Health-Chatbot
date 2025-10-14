
import React, { useState, useEffect } from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { apiService } from '../services/api';
import type { SOSContact } from '../types';

const SosPage: React.FC = () => {
  const [contacts, setContacts] = useState<SOSContact[]>([]);
  const [emergencyInfo, setEmergencyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contactsData, emergencyData] = await Promise.all([
        apiService.getSOSContacts(),
        apiService.getEmergencyInfo()
      ]);
      setContacts(contactsData);
      setEmergencyInfo(emergencyData);
    } catch (error) {
      console.error('Error loading SOS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = selectedCategory === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crisis': return 'red';
      case 'emergency': return 'orange';
      case 'support': return 'blue';
      default: return 'gray';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-neutral rounded-lg shadow-md h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-neutral rounded-lg shadow-md h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold text-red-500">Emergency Resources</h1>
      </div>
      
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <p className="text-lg text-red-800 dark:text-red-200 font-semibold">
          🚨 If you are in immediate danger, call your local emergency number (911 in US) or go to the nearest emergency room.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'crisis', 'emergency', 'support'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category === 'all' ? 'All Resources' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Guidance */}
      {emergencyInfo && (
        <div className="mb-6 space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              {emergencyInfo.warning_signs?.title}
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              {emergencyInfo.warning_signs?.signs?.slice(0, 3).map((sign: string, index: number) => (
                <li key={index}>• {sign}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Contacts */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => {
          const colorClass = getCategoryColor(contact.category);
          return (
            <div
              key={contact.id}
              className={`p-4 border rounded-lg bg-${colorClass}-50 dark:bg-${colorClass}-900/20 border-${colorClass}-200 dark:border-${colorClass}-800`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-lg font-semibold text-${colorClass}-700 dark:text-${colorClass}-300`}>
                  {contact.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full bg-${colorClass}-100 dark:bg-${colorClass}-800 text-${colorClass}-700 dark:text-${colorClass}-300 capitalize`}>
                  {contact.category}
                </span>
              </div>
              
              {contact.description && (
                <p className={`text-sm text-${colorClass}-600 dark:text-${colorClass}-400 mb-3`}>
                  {contact.description}
                </p>
              )}

              <div className="space-y-2">
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className={`h-4 w-4 text-${colorClass}-500`} />
                    <a
                      href={`tel:${contact.phone}`}
                      className={`font-medium text-${colorClass}-700 dark:text-${colorClass}-300 hover:underline`}
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className={`h-4 w-4 text-${colorClass}-500`} />
                    <a
                      href={`mailto:${contact.email}`}
                      className={`font-medium text-${colorClass}-700 dark:text-${colorClass}-300 hover:underline`}
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
              </div>

              {contact.country && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    📍 {contact.country}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SosPage;
