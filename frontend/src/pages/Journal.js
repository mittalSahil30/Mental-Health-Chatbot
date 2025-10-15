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
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'anxious', label: 'Anxious', emoji: '😰' },
    { value: 'angry', label: 'Angry', emoji: '😠' },
    { value: 'calm', label: 'Calm', emoji: '😌' },
    { value: 'excited', label: 'Excited', emoji: '🤩' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏' }
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="main-content fade-in">
      <div className="page-header">
        <h1 className="page-title">Personal Journal</h1>
        <p className="page-subtitle">
          Record your thoughts, feelings, and daily experiences in your private space for reflection and growth.
        </p>
      </div>

      {!showForm ? (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
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
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.mood === mood.value
                        ? 'border-accent-primary bg-accent-primary/10'
                        : 'border-border-color hover:border-border-hover'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
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
            <Heart className="mx-auto mb-4 text-muted" size={48} />
            <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
            <p className="text-muted mb-6">
              Start your journaling journey by creating your first entry
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
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
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Calendar size={14} />
                      <span>{format(new Date(entry.created_at), 'MMM dd, yyyy - h:mm a')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-muted hover:text-accent-primary transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-muted hover:text-accent-danger transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-secondary leading-relaxed">
                  {entry.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;