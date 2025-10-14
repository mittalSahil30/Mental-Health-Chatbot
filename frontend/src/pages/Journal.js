import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit3, FiTrash2, FiCalendar, FiHeart, FiTag } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const JournalContainer = styled.div`
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
  color: #667eea;
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

const JournalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const JournalCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const JournalTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const JournalContent = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const JournalMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #999;
`;

const JournalDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const JournalMood = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #667eea;
  font-weight: 500;
`;

const JournalTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Actions = styled.div`
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
  max-width: 600px;
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
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5a6fd8;
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

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    tags: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const response = await axios.get('/journal');
      setJournals(response.data);
    } catch (error) {
      console.error('Failed to fetch journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const journalData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      if (editingJournal) {
        await axios.put(`/journal/${editingJournal.id}`, journalData);
      } else {
        await axios.post('/journal', journalData);
      }

      setShowModal(false);
      setEditingJournal(null);
      setFormData({ title: '', content: '', mood: '', tags: '' });
      fetchJournals();
    } catch (error) {
      console.error('Failed to save journal:', error);
    }
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setFormData({
      title: journal.title,
      content: journal.content,
      mood: journal.mood || '',
      tags: journal.tags ? journal.tags.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (journalId) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await axios.delete(`/journal/${journalId}`);
        fetchJournals();
      } catch (error) {
        console.error('Failed to delete journal:', error);
      }
    }
  };

  const openModal = () => {
    setEditingJournal(null);
    setFormData({ title: '', content: '', mood: '', tags: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJournal(null);
    setFormData({ title: '', content: '', mood: '', tags: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <JournalContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>
          Loading your journal entries...
        </div>
      </JournalContainer>
    );
  }

  return (
    <JournalContainer>
      <Header>
        <Title>My Journal</Title>
        <AddButton onClick={openModal}>
          <FiPlus />
          New Entry
        </AddButton>
      </Header>

      {journals.length === 0 ? (
        <EmptyState>
          <EmptyTitle>Start Your Mental Health Journey</EmptyTitle>
          <EmptyText>
            Begin documenting your thoughts, feelings, and experiences. 
            Your journal is a safe space for self-reflection and growth.
          </EmptyText>
          <AddButton onClick={openModal}>
            <FiPlus />
            Write Your First Entry
          </AddButton>
        </EmptyState>
      ) : (
        <JournalGrid>
          {journals.map((journal) => (
            <JournalCard key={journal.id}>
              <JournalTitle>{journal.title}</JournalTitle>
              <JournalContent>{journal.content}</JournalContent>
              
              {journal.mood && (
                <JournalMood>
                  <FiHeart />
                  {journal.mood}
                </JournalMood>
              )}
              
              {journal.tags && journal.tags.length > 0 && (
                <JournalTags>
                  {journal.tags.map((tag, index) => (
                    <Tag key={index}>
                      <FiTag />
                      {tag}
                    </Tag>
                  ))}
                </JournalTags>
              )}
              
              <JournalMeta>
                <JournalDate>
                  <FiCalendar />
                  {formatDate(journal.created_at)}
                </JournalDate>
              </JournalMeta>
              
              <Actions>
                <ActionButton onClick={() => handleEdit(journal)}>
                  <FiEdit3 />
                </ActionButton>
                <ActionButton 
                  className="delete" 
                  onClick={() => handleDelete(journal.id)}
                >
                  <FiTrash2 />
                </ActionButton>
              </Actions>
            </JournalCard>
          ))}
        </JournalGrid>
      )}

      {showModal && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingJournal ? 'Edit Entry' : 'New Journal Entry'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Entry title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              
              <TextArea
                placeholder="How are you feeling today? What's on your mind?"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
              
              <Select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
              >
                <option value="">How are you feeling? (Optional)</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="anxious">😰 Anxious</option>
                <option value="calm">😌 Calm</option>
                <option value="excited">🤩 Excited</option>
                <option value="tired">😴 Tired</option>
                <option value="confused">😕 Confused</option>
                <option value="grateful">🙏 Grateful</option>
              </Select>
              
              <Input
                type="text"
                placeholder="Tags (comma-separated, e.g., work, family, stress)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              
              <ButtonGroup>
                <Button type="button" className="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="primary">
                  {editingJournal ? 'Update Entry' : 'Save Entry'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </JournalContainer>
  );
};

export default Journal;