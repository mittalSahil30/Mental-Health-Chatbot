
import React, { useEffect, useState } from 'react';
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { getSos } from '../api/misc';

const SosPage: React.FC = () => {
  const [hotlines, setHotlines] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSos();
        setHotlines(res.hotlines || []);
        setEmails(res.emails || []);
      } catch {
        setHotlines([]);
        setEmails([]);
      }
    })();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-neutral rounded-lg shadow-md h-full">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Immediate Help</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        If you are in a crisis or any other person may be in danger, please use these resources. They are available 24/7.
      </p>

      <div className="space-y-6">
        {hotlines.map((h) => (
          <div key={h.name} className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-2">{h.name}</h2>
            <div className="flex items-center space-x-4 text-lg">
              {h.phone && <><PhoneIcon className="h-6 w-6" /><a href={`tel:${h.phone}`} className="font-bold hover:underline">{h.phone}</a></>}
              {h.text && <><EnvelopeIcon className="h-6 w-6" /><span className="font-bold">{h.text}</span></>}
              {h.url && <><GlobeAltIcon className="h-6 w-6" /><a href={h.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">Visit Website</a></>}
            </div>
          </div>
        ))}

        {emails.length > 0 && (
          <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-semibold mb-2">Important Emails</h2>
            <ul className="space-y-2">
              {emails.map((e) => (
                <li key={e.email} className="flex items-center space-x-4">
                  <EnvelopeIcon className="h-6 w-6" />
                  <span className="font-bold">{e.name}:</span>
                  <a href={`mailto:${e.email}`} className="hover:underline">{e.email}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SosPage;
