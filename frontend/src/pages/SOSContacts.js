import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Phone, Mail, User, AlertTriangle, Heart } from 'lucide-react';
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
    type: 'emergency'
  });
  const [loading, setLoading] = useState(true);

  const contactTypes = [
    { value: 'emergency', label: 'Emergency Services', icon: '🚨', color: 'text-red-500' },
    { value: 'therapist', label: 'Therapist/Counselor', icon: '👨‍⚕️', color: 'text-blue-500' },
    { value: 'family', label: 'Family Member', icon: '👨‍👩‍👧‍👦', color: 'text-green-500' },
    { value: 'friend', label: 'Close Friend', icon: '👫', color: 'text-purple-500' },
    { value: 'crisis', label: 'Crisis Hotline', icon: '📞', color: 'text-orange-500' },
    { value: 'other', label: 'Other', icon: '👤', color: 'text-gray-500' }
  ];

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
    
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      toast.error('Please provide at least a name and either phone or email');
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
      setFormData({ name: '', phone: '', email: '', type: 'emergency' });
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
      phone: contact.phone,
      email: contact.email,
      type: contact.type
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
    setFormData({ name: '', phone: '', email: '', type: 'emergency' });
  };

  const getContactIcon = (type) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.icon : '👤';
  };

  const getContactColor = (type) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.color : 'text-gray-500';
  };

  const getContactLabel = (type) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.label : 'Other';
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_self');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="sos-contacts-page fade-in">
      <div className="text-center mb-12">
        <div className="floating">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="gradient-text">SOS Contacts</span>
          </h1>
        </div>
        <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          Emergency contacts and crisis support resources to ensure you have immediate access to help when you need it most.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!showForm ? (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus className="mr-2" size={20} />
              Add Contact
            </button>
          </div>
        ) : (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  <label className="form-label">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-input"
                  >
                    {contactTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <AlertTriangle className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No contacts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Add emergency contacts and support resources for quick access
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <Plus className="mr-2" size={20} />
                Add First Contact
              </button>
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className={`text-2xl ${getContactColor(contact.type)}`}>
                      {getContactIcon(contact.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{contact.name}</h3>
                      <p className={`text-sm ${getContactColor(contact.type)}`}>
                        {getContactLabel(contact.type)}
                      </p>
                      
                      <div className="mt-3 space-y-2">
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-500" />
                            <span className="text-gray-700">{contact.phone}</span>
                            <button
                              onClick={() => handleCall(contact.phone)}
                              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                              Call
                            </button>
                          </div>
                        )}
                        
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-500" />
                            <span className="text-gray-700">{contact.email}</span>
                            <button
                              onClick={() => handleEmail(contact.email)}
                              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                              Email
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
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