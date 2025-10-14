
import React, { useState } from 'react';
import { useJournal } from '../contexts/JournalContext';
import type { JournalEntry } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const JournalModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
}> = ({ isOpen, onClose, entry }) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const { addEntry, updateEntry } = useJournal();

  React.useEffect(() => {
    setTitle(entry?.title || '');
    setContent(entry?.content || '');
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry) {
      updateEntry(entry.id, { title, content });
    } else {
      addEntry({ title, content });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">{entry ? 'Edit Entry' : 'New Entry'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-light dark:bg-dark border-gray-300 dark:border-gray-600"
            required
          />
          <textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-4 border rounded bg-light dark:bg-dark border-gray-300 dark:border-gray-600 h-64"
            required
          />
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const JournalPage: React.FC = () => {
  const { entries, deleteEntry } = useJournal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };
  
  const handleDeleteEntry = (id: string) => {
      if (window.confirm("Are you sure you want to delete this entry?")) {
          deleteEntry(id);
      }
  }

  return (
    <div className="p-4 bg-white dark:bg-neutral rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Journal</h1>
        <button onClick={handleNewEntry} className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          New Entry
        </button>
      </div>

      <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map(entry => (
            <div key={entry.id} className="p-4 border rounded-lg bg-light dark:bg-dark border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{entry.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                        {new Date(entry.updatedAt).toLocaleString()}
                    </p>
                    <p className="text-neutral dark:text-light whitespace-pre-wrap">{entry.content.substring(0, 150)}{entry.content.length > 150 ? '...' : ''}</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                      <button onClick={() => handleEditEntry(entry)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><PencilIcon className="h-5 w-5"/></button>
                      <button onClick={() => handleDeleteEntry(entry.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5"/></button>
                  </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Your journal is empty. Start by creating a new entry.</p>
          </div>
        )}
      </div>

      <JournalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} entry={selectedEntry} />
    </div>
  );
};

export default JournalPage;
