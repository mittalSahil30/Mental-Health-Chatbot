import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral'
  });
  const [loading, setLoading] = useState(true);

  const moods = [
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'text-yellow-500' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'text-blue-500' },
    { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-orange-500' },
    { value: 'angry', label: 'Angry', emoji: '😠', color: 'text-red-500' },
    { value: 'calm', label: 'Calm', emoji: '😌', color: 'text-green-500' },
    { value: 'excited', label: 'Excited', emoji: '🤩', color: 'text-purple-500' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-gray-500' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'text-indigo-500' }
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/journal');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    try {
      if (editingEntry) {
        await axios.put(`/journal/${editingEntry.id}`, formData);
        toast.success('Entry updated successfully');
      } else {
        await axios.post('/journal', formData);
        toast.success('Entry created successfully');
      }
      
      setShowForm(false);
      setEditingEntry(null);
      setFormData({ title: '', content: '', mood: 'neutral' });
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood
    });
    setShowForm(true);
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await axios.delete(`/journal/${entryId}`);
      toast.success('Entry deleted successfully');
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
    setFormData({ title: '', content: '', mood: 'neutral' });
  };

  const getMoodEmoji = (mood) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.emoji : '😐';
  };

  const getMoodColor = (mood) => {
    const moodObj = moods.find(m => m.value === mood);
    return moodObj ? moodObj.color : 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="journal-page fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="floating">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              <span className="gradient-text">Personal Journal</span>
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Record your thoughts, feelings, and daily experiences in your private space for reflection and growth.
          </p>
        </div>

      <div className="max-w-4xl mx-auto">
        {!showForm ? (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary text-lg px-8 py-4"
            >
              <Plus className="mr-2" size={20} />
              New Entry
            </button>
          </div>
        ) : (
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="card-title">
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  placeholder="What's on your mind today?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">How are you feeling?</label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood.value })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        formData.mood === mood.value
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="form-input"
                  rows={6}
                  placeholder="Write about your day, thoughts, or anything you'd like to remember..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="card text-center py-12">
              <Heart className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No entries yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start your journaling journey by creating your first entry
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <Plus className="mr-2" size={20} />
                Create First Entry
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{entry.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{format(new Date(entry.created_at), 'MMM dd, yyyy - h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Journal;