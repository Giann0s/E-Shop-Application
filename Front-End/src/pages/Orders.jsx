import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        navigate('/');
        return;
    }

    api.get('/orders/my-orders')
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) return <div className="text-center py-20 text-gray-500">Φόρτωση παραγγελιών...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Οι Παραγγελίες μου</h2>
      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-md border text-center text-gray-500">
          Δεν έχετε πραγματοποιήσει καμία παραγγελία ακόμα.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-md shadow-sm border p-6">
              <div className="flex flex-wrap justify-between items-center border-b pb-4 mb-4 gap-2">
                <div>
                  <p className="text-sm text-gray-500">ID: <span className="font-semibold text-gray-800">#{order.id}</span></p>
                  <p className="text-sm text-gray-500">Ημερομηνία: {new Date(order.orderDate).toLocaleDateString('el-GR')}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-semibold uppercase mb-1">
                    {order.status}
                  </span>
                  <p className="font-bold text-lg text-vinted">{order.totalAmount.toFixed(2)} €</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Διεύθυνση Αποστολής:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">{order.shippingAddress}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Προϊόντα:</p>
                <div className="divide-y bg-gray-50 rounded px-4">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="py-2 flex justify-between text-sm text-gray-600">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span className="font-semibold">{item.totalPrice.toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;