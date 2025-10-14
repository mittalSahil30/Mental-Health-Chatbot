
import React from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

const SosPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-neutral rounded-lg shadow-md h-full">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Immediate Help</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        If you are in a crisis or any other person may be in danger, please use these resources. They are available 24/7.
      </p>

      <div className="space-y-6">
        <div className="p-6 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">National Suicide Prevention Lifeline</h2>
          <div className="flex items-center space-x-4 text-lg">
            <PhoneIcon className="h-6 w-6 text-red-500" />
            <a href="tel:988" className="font-bold text-red-700 dark:text-red-300 hover:underline">988</a>
          </div>
        </div>
        
        <div className="p-6 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Crisis Text Line</h2>
          <div className="flex items-center space-x-4 text-lg">
            <EnvelopeIcon className="h-6 w-6 text-blue-500" />
            <p className="font-bold text-blue-700 dark:text-blue-300">Text HOME to 741741</p>
          </div>
        </div>

        <div className="p-6 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">The Trevor Project (for LGBTQ Youth)</h2>
           <div className="flex items-center space-x-4 text-lg mb-2">
            <PhoneIcon className="h-6 w-6 text-green-500" />
            <a href="tel:1-866-488-7386" className="font-bold text-green-700 dark:text-green-300 hover:underline">1-866-488-7386</a>
          </div>
           <div className="flex items-center space-x-4 text-lg">
            <GlobeAltIcon className="h-6 w-6 text-green-500" />
             <a href="https://www.thetrevorproject.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-green-700 dark:text-green-300 hover:underline">Visit Website</a>
          </div>
        </div>
        
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Local Emergency Services</h2>
           <div className="flex items-center space-x-4 text-lg">
            <PhoneIcon className="h-6 w-6 text-gray-500" />
            <a href="tel:911" className="font-bold text-gray-700 dark:text-gray-300 hover:underline">Call 911</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SosPage;
