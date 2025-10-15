import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SOSContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/sos-contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      if (editingContact) {
        await axios.put(`/sos-contacts/${editingContact.id}`, formData);
        toast.success('Contact updated successfully');
      } else {
        await axios.post('/sos-contacts', formData);
        toast.success('Contact added successfully');
      }
      
      setShowForm(false);
      setEditingContact(null);
      setFormData({ name: '', phone: '', email: '', relationship: '', notes: '' });
      fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone || '',
      email: contact.email || '',
      relationship: contact.relationship || '',
      notes: contact.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await axios.delete(`/sos-contacts/${contactId}`);
      toast.success('Contact deleted successfully');
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingContact(null);
    setFormData({ name: '', phone: '', email: '', relationship: '', notes: '' });
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_self');
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
        <h1 className="page-title">SOS Contacts</h1>
        <p className="page-subtitle">
          Manage your emergency contacts and support resources for quick access when you need help.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!showForm ? (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Add Contact
            </button>
          </div>
        ) : (
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="card-title">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Contact name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship</label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Family, Friend, Therapist"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    placeholder="Phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-input"
                  rows={3}
                  placeholder="Additional notes or instructions"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">
                  {editingContact ? 'Update Contact' : 'Add Contact'}
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

        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="card text-center py-12">
              <AlertTriangle className="mx-auto mb-4 text-muted" size={48} />
              <h3 className="text-lg font-semibold text-muted mb-2">
                No contacts yet
              </h3>
              <p className="text-muted mb-6">
                Add emergency contacts and support resources for quick access
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Add First Contact
              </button>
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{contact.name}</h3>
                      {contact.relationship && (
                        <span className="px-2 py-1 bg-accent-primary/10 text-accent-primary text-sm rounded-full">
                          {contact.relationship}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-muted" />
                          <span className="text-secondary">{contact.phone}</span>
                          <button
                            onClick={() => handleCall(contact.phone)}
                            className="text-accent-primary hover:text-accent-secondary text-sm font-medium"
                          >
                            Call
                          </button>
                        </div>
                      )}
                      
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-muted" />
                          <span className="text-secondary">{contact.email}</span>
                          <button
                            onClick={() => handleEmail(contact.email)}
                            className="text-accent-primary hover:text-accent-secondary text-sm font-medium"
                          >
                            Email
                          </button>
                        </div>
                      )}
                      
                      {contact.notes && (
                        <p className="text-muted text-sm mt-2">{contact.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-muted hover:text-accent-primary transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-muted hover:text-accent-danger transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSContacts;