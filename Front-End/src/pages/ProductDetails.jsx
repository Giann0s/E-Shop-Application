import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const product = location.state?.product;

  if (!product) {
    return <div className="p-10 text-center text-red-500">Το προϊόν δεν βρέθηκε! Γυρίστε στην αρχική.</div>;
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert("Πρέπει να συνδεθείτε για να προσθέσετε στο καλάθι!");
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart/add', {
        productId: product.id,
        quantity: 1
      });
      alert('Προστέθηκε επιτυχώς στο καλάθι!');
    } catch (error) {
      console.error("Σφάλμα:", error);
      alert('Υπήρξε σφάλμα κατά την προσθήκη στο καλάθι.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-10">
      
      <div className="md:w-1/2">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full rounded-lg shadow-md object-cover max-h-[80vh]"
          />
        ) : (
          <div className="w-full h-[30rem] bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <span className="text-gray-400 text-lg">Χωρίς Φωτογραφία</span>
          </div>
        )}
      </div>

      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-3xl text-vinted font-semibold mb-6">{product.price.toFixed(2)} €</p>
        
        <div className="mb-8">
          <p className="text-gray-500 mb-2">Κατηγορίες:</p>
          <div className="flex gap-2 flex-wrap">
            {product.categories.map((cat, idx) => (
              <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className="bg-vinted text-white py-3 px-8 rounded-md text-lg hover:bg-vintedHover transition font-semibold w-full md:w-auto shadow-md"
        >
          Προσθήκη στο καλάθι
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;