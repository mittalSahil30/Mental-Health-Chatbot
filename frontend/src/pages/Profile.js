import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6fd8;
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #333;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

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

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const StatsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
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
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    emergency_contact: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    journalEntries: 0,
    testsCompleted: 0,
    exercisesCompleted: 0,
    daysActive: 0
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        age: user.age || '',
        gender: user.gender || '',
        phone: user.phone || '',
        emergency_contact: user.emergency_contact || ''
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch user statistics
      const [journalsResponse, testsResponse] = await Promise.all([
        axios.get('/journal'),
        axios.get('/test')
      ]);

      setStats({
        journalEntries: journalsResponse.data.length,
        testsCompleted: testsResponse.data.length,
        exercisesCompleted: 0, // This would need to be tracked separately
        daysActive: 1 // This would need to be calculated based on activity
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: user.full_name || '',
      age: user.age || '',
      gender: user.gender || '',
      phone: user.phone || '',
      emergency_contact: user.emergency_contact || ''
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.put('/profile', formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <ProfileContainer>
        <EmptyState>
          <EmptyTitle>Please log in to view your profile</EmptyTitle>
          <EmptyText>You need to be logged in to access your profile information.</EmptyText>
        </EmptyState>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Header>
        <Title>My Profile</Title>
        <Subtitle>
          Manage your personal information and view your mental health journey statistics.
        </Subtitle>
      </Header>

      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>
            <FiUser />
            Personal Information
          </ProfileTitle>
          {!isEditing && (
            <EditButton onClick={handleEdit}>
              <FiEdit3 />
              Edit Profile
            </EditButton>
          )}
        </ProfileHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <form onSubmit={handleSubmit}>
          <ProfileInfo>
            <InfoItem>
              <InfoLabel>Full Name</InfoLabel>
              {isEditing ? (
                <Input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <InfoValue>
                  <FiUser />
                  {user.full_name || 'Not provided'}
                </InfoValue>
              )}
            </InfoItem>

            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>
                <FiMail />
                {user.email || 'Not provided'}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Age</InfoLabel>
              {isEditing ? (
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  min="13"
                  max="120"
                />
              ) : (
                <InfoValue>
                  <FiCalendar />
                  {user.age || 'Not provided'}
                </InfoValue>
              )}
            </InfoItem>

            <InfoItem>
              <InfoLabel>Gender</InfoLabel>
              {isEditing ? (
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </Select>
              ) : (
                <InfoValue>
                  <FiUser />
                  {user.gender || 'Not provided'}
                </InfoValue>
              )}
            </InfoItem>

            <InfoItem>
              <InfoLabel>Phone</InfoLabel>
              {isEditing ? (
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              ) : (
                <InfoValue>
                  <FiPhone />
                  {user.phone || 'Not provided'}
                </InfoValue>
              )}
            </InfoItem>

            <InfoItem>
              <InfoLabel>Emergency Contact</InfoLabel>
              {isEditing ? (
                <Input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="Enter emergency contact number"
                />
              ) : (
                <InfoValue>
                  <FiPhone />
                  {user.emergency_contact || 'Not provided'}
                </InfoValue>
              )}
            </InfoItem>
          </ProfileInfo>

          {isEditing && (
            <ButtonGroup>
              <Button type="button" className="secondary" onClick={handleCancel}>
                <FiX />
                Cancel
              </Button>
              <Button type="submit" className="primary" disabled={loading}>
                <FiSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          )}
        </form>
      </ProfileCard>

      <StatsCard>
        <StatsTitle>Your Mental Health Journey</StatsTitle>
        <StatsGrid>
          <StatItem>
            <StatValue>{stats.journalEntries}</StatValue>
            <StatLabel>Journal Entries</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{stats.testsCompleted}</StatValue>
            <StatLabel>Tests Completed</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{stats.exercisesCompleted}</StatValue>
            <StatLabel>Exercises Completed</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{stats.daysActive}</StatValue>
            <StatLabel>Days Active</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsCard>

      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>Account Actions</ProfileTitle>
        </ProfileHeader>
        <ButtonGroup>
          <Button className="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </ButtonGroup>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;