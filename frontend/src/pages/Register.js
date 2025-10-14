import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
  ${props => props.fullWidth && 'grid-column: 1 / -1;'}
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.2rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PrivacyNote = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    phone: '',
    emergency_contact: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Remove confirmPassword from data sent to API
    const { confirmPassword, ...userData } = formData;
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/chatbot');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Create Account</Title>
        <Subtitle>Join our mental health community</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <PrivacyNote>
          <strong>Privacy First:</strong> Your data is encrypted and secure. 
          You can also use our chatbot as a guest without creating an account.
        </PrivacyNote>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup fullWidth>
            <InputIcon>
              <FiUser />
            </InputIcon>
            <Input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </InputGroup>
          
          <Row>
            <InputGroup>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Row>
          
          <Row>
            <InputGroup>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Row>
          
          <Row>
            <InputGroup>
              <InputIcon>
                <FiCalendar />
              </InputIcon>
              <Input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                min="13"
                max="120"
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Gender (Optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </Select>
            </InputGroup>
          </Row>
          
          <Row>
            <InputGroup>
              <InputIcon>
                <FiPhone />
              </InputIcon>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone (Optional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiPhone />
              </InputIcon>
              <Input
                type="tel"
                name="emergency_contact"
                placeholder="Emergency Contact (Optional)"
                value={formData.emergency_contact}
                onChange={handleChange}
              />
            </InputGroup>
          </Row>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>
        
        <LinkText>
          Already have an account? <Link to="/login">Sign in</Link>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;