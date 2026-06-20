import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert("Λάθος κωδικοί!");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-vinted">Σύνδεση</h2>
        <input 
          type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vinted"
        />
        <input 
          type="password" placeholder="Κωδικός" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vinted"
        />
        <button type="submit" className="w-full bg-vinted text-white py-2 rounded-md hover:bg-vintedHover">
          Είσοδος
        </button>
      </form>
    </div>
  );
};

export default Login;