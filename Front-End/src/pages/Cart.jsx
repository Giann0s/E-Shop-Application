import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση του καλαθιού", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      if (window.confirm("Θέλετε να αφαιρέσετε το προϊόν από το καλάθι;")) {
        handleRemoveItem(cartItemId);
      }
      return;
    }
    try {
      const res = await api.put(`/cart/update/${cartItemId}`, { quantity: newQuantity });
      setCart(res.data);
    } catch (error) {
      alert('Σφάλμα κατά την ενημέρωση ποσότητας.');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/remove/${cartItemId}`);
      setCart(res.data);
    } catch (error) {
      alert('Σφάλμα κατά την αφαίρεση του προϊόντος.');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Είστε σίγουροι ότι θέλετε να αδειάσετε ολόκληρο το καλάθι;")) {
      try {
        const res = await api.delete('/cart/clear');
        setCart(res.data);
      } catch (error) {
        alert('Σφάλμα κατά το άδειασμα του καλαθιού.');
      }
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      alert("Παρακαλώ συμπληρώστε τη διεύθυνση αποστολής!");
      return;
    }
    try {
      await api.post('/orders/checkout', { shippingAddress });
      alert('Η παραγγελία σας ολοκληρώθηκε με επιτυχία!');
      setCart(null);
      navigate('/');
    } catch (error) {
      alert('Υπήρξε πρόβλημα κατά την ολοκλήρωση της παραγγελίας.');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Φόρτωση καλαθιού...</div>;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Πρέπει να συνδεθείτε</h2>
        <Link to="/login" className="bg-vinted text-white px-6 py-3 rounded-md font-semibold hover:bg-vintedHover transition">Σύνδεση</Link>
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Το καλάθι σας είναι άδειο!</h2>
        <Link to="/" className="bg-vinted text-white px-6 py-3 rounded-md font-semibold hover:bg-vintedHover transition">Συνέχεια Αγορών</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Το Καλάθι μου</h1>
        <button onClick={handleClearCart} className="text-gray-500 hover:text-red-600 text-sm underline transition">Άδειασμα καλαθιού</button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 space-y-4">
          {cart.cartItems.map((item) => (
            <div key={item.id} className="flex bg-white p-4 rounded-lg shadow-sm border border-gray-100 items-center gap-4 relative">
              <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden flex justify-center items-center">
                {item.product.imageUrl ? <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Χωρίς εικόνα</span>}
              </div>
              <div className="flex-grow">
                <Link to={`/product/${item.product.id}`} state={{ product: item.product }} className="font-bold text-lg hover:underline text-gray-800">{item.product.name}</Link>
                <p className="text-gray-500 text-sm">{item.unitPrice.toFixed(2)} € / τμχ</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} className="w-8 h-8 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300 transition text-lg font-medium">-</button>
                  <span className="w-6 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} className="w-8 h-8 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300 transition text-lg font-medium">+</button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 justify-center h-full">
                <span className="font-bold text-xl text-vinted">{(item.totalPrice || 0).toFixed(2)} €</span>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 mt-2">🗑 Αφαίρεση</button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-20">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Σύνοψη Παραγγελίας</h2>
            <div className="flex justify-between mb-2 text-gray-600"><span>Προϊόντα</span><span>{(cart.totalAmount || 0).toFixed(2)} €</span></div>
            <div className="flex justify-between font-bold text-2xl border-t pt-4 mt-4 mb-6"><span>Σύνολο</span><span>{(cart.totalAmount || 0).toFixed(2)} €</span></div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Διεύθυνση Αποστολής *</label>
              <textarea rows="2" required placeholder="π.χ. Ερμού 12, Αθήνα, 10563" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-vinted text-sm resize-none"></textarea>
            </div>
            <button onClick={handleCheckout} className="w-full bg-vinted text-white py-3 rounded-md font-bold text-lg hover:bg-vintedHover transition shadow-md">Ολοκλήρωση Αγοράς</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;