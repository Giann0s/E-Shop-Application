import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Οι κωδικοί δεν ταιριάζουν!");
      return;
    }

    try {
      await api.post('/user', { email, password });
      
      alert("Η εγγραφή ήταν επιτυχής! Μπορείτε πλέον να συνδεθείτε.");
      navigate('/login'); 
    } catch (err) {
      alert("Σφάλμα κατά την εγγραφή. Ίσως το email να χρησιμοποιείται ήδη.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-vinted">Εγγραφή</h2>
        
        <input 
          type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vinted"
        />
        <input 
          type="password" required placeholder="Κωδικός" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vinted"
        />
        <input 
          type="password" required placeholder="Επιβεβαίωση Κωδικού" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vinted"
        />
        
        <button type="submit" className="w-full bg-vinted text-white py-2 rounded-md hover:bg-vintedHover mb-4 transition font-semibold">
          Δημιουργία Λογαριασμού
        </button>
        
        <div className="text-center text-sm text-gray-500">
          Έχετε ήδη λογαριασμό; <Link to="/login" className="text-vinted font-semibold hover:underline">Συνδεθείτε</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;