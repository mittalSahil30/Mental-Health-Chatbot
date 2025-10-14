import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit3, FiTrash2, FiPhone, FiMail, FiBuilding, FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';

const SOSContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const AddButton = styled.button`
  background: white;
  color: #dc3545;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const EmergencyBanner = styled.div`
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
`;

const EmergencyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const EmergencyText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const EmergencyNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 12px;
  margin: 1rem 0;
`;

const ContactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ContactCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  ${props => props.isEmergency && `
    border-left: 4px solid #dc3545;
  `}
`;

const ContactHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ContactName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const EmergencyBadge = styled.span`
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const ContactActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  color: #666;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
  }

  &.delete:hover {
    background: #fee;
    color: #c33;
    border-color: #c33;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #dc3545;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #dc3545;
    color: white;

    &:hover {
      background: #c82333;
    }
  }

  &.secondary {
    background: #f0f0f0;
    color: #333;

    &:hover {
      background: #e0e0e0;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: white;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
`;

const SOSContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: '',
    description: '',
    is_emergency: true
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/sos');
      setContacts(response.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingContact) {
        await axios.put(`/sos/${editingContact.id}`, formData);
      } else {
        await axios.post('/sos', formData);
      }

      setShowModal(false);
      setEditingContact(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        organization: '',
        description: '',
        is_emergency: true
      });
      fetchContacts();
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      organization: contact.organization || '',
      description: contact.description || '',
      is_emergency: contact.is_emergency
    });
    setShowModal(true);
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`/sos/${contactId}`);
        fetchContacts();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  const openModal = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      organization: '',
      description: '',
      is_emergency: true
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      organization: '',
      description: '',
      is_emergency: true
    });
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    window.open(`mailto:${email}`);
  };

  if (loading) {
    return (
      <SOSContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>
          Loading emergency contacts...
        </div>
      </SOSContainer>
    );
  }

  return (
    <SOSContainer>
      <Header>
        <Title>Emergency Contacts</Title>
        <AddButton onClick={openModal}>
          <FiPlus />
          Add Contact
        </AddButton>
      </Header>

      <EmergencyBanner>
        <EmergencyTitle>
          <FiAlertTriangle />
          In Crisis? Get Help Now
        </EmergencyTitle>
        <EmergencyText>
          If you're having thoughts of self-harm or suicide, please reach out immediately:
        </EmergencyText>
        <EmergencyNumber>988</EmergencyNumber>
        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          National Suicide Prevention Lifeline (24/7)
        </p>
      </EmergencyBanner>

      {contacts.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No Emergency Contacts</EmptyTitle>
          <EmptyText>
            Add emergency contacts and mental health resources for quick access during difficult times.
          </EmptyText>
          <AddButton onClick={openModal}>
            <FiPlus />
            Add Your First Contact
          </AddButton>
        </EmptyState>
      ) : (
        <ContactsGrid>
          {contacts.map((contact) => (
            <ContactCard key={contact.id} isEmergency={contact.is_emergency}>
              <ContactHeader>
                <div>
                  <ContactName>{contact.name}</ContactName>
                  {contact.is_emergency && <EmergencyBadge>Emergency</EmergencyBadge>}
                </div>
              </ContactHeader>

              <ContactInfo>
                <ContactItem>
                  <FiPhone />
                  <span 
                    style={{ cursor: 'pointer', color: '#dc3545', fontWeight: '600' }}
                    onClick={() => handleCall(contact.phone)}
                  >
                    {contact.phone}
                  </span>
                </ContactItem>
                
                {contact.email && (
                  <ContactItem>
                    <FiMail />
                    <span 
                      style={{ cursor: 'pointer', color: '#667eea' }}
                      onClick={() => handleEmail(contact.email)}
                    >
                      {contact.email}
                    </span>
                  </ContactItem>
                )}
                
                {contact.organization && (
                  <ContactItem>
                    <FiBuilding />
                    <span>{contact.organization}</span>
                  </ContactItem>
                )}
                
                {contact.description && (
                  <ContactItem>
                    <span style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {contact.description}
                    </span>
                  </ContactItem>
                )}
              </ContactInfo>

              <ContactActions>
                <ActionButton onClick={() => handleCall(contact.phone)}>
                  <FiPhone />
                </ActionButton>
                <ActionButton onClick={() => handleEdit(contact)}>
                  <FiEdit3 />
                </ActionButton>
                <ActionButton 
                  className="delete" 
                  onClick={() => handleDelete(contact.id)}
                >
                  <FiTrash2 />
                </ActionButton>
              </ContactActions>
            </ContactCard>
          ))}
        </ContactsGrid>
      )}

      {showModal && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Contact name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              
              <Input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              
              <Input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              
              <Input
                type="text"
                placeholder="Organization (optional)"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
              
              <TextArea
                placeholder="Description or notes (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  checked={formData.is_emergency}
                  onChange={(e) => setFormData({ ...formData, is_emergency: e.target.checked })}
                />
                <span>Mark as emergency contact</span>
              </CheckboxContainer>
              
              <ButtonGroup>
                <Button type="button" className="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="primary">
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </SOSContainer>
  );
};

export default SOSContacts;