import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import  {login as loginservice} from '../api/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { 
      setError('Please fill in all fields.');
      return;
    }
    const result = await loginservice(email, password);
    console.log('Login result:', result);
    if (!result) {
      setError('Invalid email or password.');
      return;
    }
    login(result);
    navigate('/');
  };

  return (
    <div className="form-page">
      <h1>Welcome back</h1>
      <p>Sign in to your account</p>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ravi@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
        </div>
        <button type="submit" className="form-submit">Sign In</button>
      </form>
      <div className="form-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
