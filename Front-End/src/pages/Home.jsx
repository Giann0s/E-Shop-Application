import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState('');
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');
  const [newProdCatIds, setNewProdCatIds] = useState([]); 
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCatName, setNewCatName] = useState('');

  const location = useLocation();
  const { isAdmin } = useContext(AuthContext);

  const fetchCategories = () => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (!queryParams.has('search')) {
      setSelectedCategories([]);
      setMaxPrice('');
    }
  }, [location.search]);

  const fetchProducts = () => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');

    if (searchQuery) {
      api.get(`/products/search?keyword=${encodeURIComponent(searchQuery)}`)
        .then(res => {
          let data = res.data;
          if (maxPrice) {
            data = data.filter(p => p.price <= parseFloat(maxPrice));
          }
          setProducts(data);
        })
        .catch(console.error);
    } else {
      const params = {};
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedCategories.length > 0) params.categoryIds = selectedCategories.join(',');

      api.get('/products', { params })
        .then(res => setProducts(res.data))
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.search, selectedCategories, maxPrice]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };


  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCatName });
      alert('Η κατηγορία προστέθηκε!');
      setNewCatName('');
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert('Σφάλμα κατά την προσθήκη κατηγορίας.');
    }
  };

  const openCategoryEditModal = (cat) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setIsCategoryEditModalOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/categories/${editingCategory.id}`, { name: newCatName });
      alert('Η κατηγορία ενημερώθηκε!');
      setNewCatName('');
      setEditingCategory(null);
      setIsCategoryEditModalOpen(false);
      fetchCategories();
      fetchProducts(); 
    } catch (err) {
      alert('Σφάλμα κατά την ενημέρωση κατηγορίας.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κατηγορία;')) {
      try {
        await api.delete(`/categories/${id}`);
        alert('Η κατηγορία διαγράφηκε!');
        fetchCategories();
        fetchProducts();
      } catch (err) {
        alert('Σφάλμα κατά τη διαγραφή.');
      }
    }
  };


  const handleFormCategoryToggle = (categoryId) => {
    setNewProdCatIds(prev => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (newProdCatIds.length === 0) {
      alert("Επιλέξτε τουλάχιστον μία κατηγορία!");
      return;
    }
    try {
      await api.post('/products', {
        name: newProdName,
        price: parseFloat(newProdPrice),
        imageUrl: newProdImageUrl,
        categoryList: newProdCatIds.map(id => ({ id })) 
      });
      alert('Το προϊόν προστέθηκε!');
      resetProductForm();
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Σφάλμα κατά την προσθήκη προϊόντος.');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setNewProdName(product.name);
    setNewProdPrice(product.price);
    setNewProdImageUrl(product.imageUrl || '');
    
    const existingCatIds = product.categories
      .map(catName => categories.find(c => c.name === catName)?.id)
      .filter(id => id !== undefined);
      
    setNewProdCatIds(existingCatIds);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (newProdCatIds.length === 0) {
      alert("Επιλέξτε τουλάχιστον μία κατηγορία!");
      return;
    }
    try {
      const payload = {
        name: newProdName,
        price: parseFloat(newProdPrice),
        imageUrl: newProdImageUrl,
        categoryList: newProdCatIds.map(id => ({ id }))
      };
      
      await api.put(`/products/${editingProduct.id}`, payload);
      alert('Το προϊόν ενημερώθηκε!');
      resetProductForm();
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Σφάλμα κατά την ενημέρωση προϊόντος.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Είστε σίγουροι;')) {
      try {
        await api.delete(`/products/${id}`); 
        alert('Το προϊόν διαγράφηκε!');
        fetchProducts();
      } catch (err) {
        alert('Σφάλμα κατά τη διαγραφή.');
      }
    }
  };

  const resetProductForm = () => {
    setNewProdName('');
    setNewProdPrice('');
    setNewProdImageUrl('');
    setNewProdCatIds([]);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-4 rounded-md shadow-sm border mb-6">
          <h3 className="font-bold text-lg mb-4">Φίλτρα</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Μέγιστη Τιμή (€)</label>
            <input 
              type="number" 
              placeholder="π.χ. 50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-vinted text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Κατηγορίες</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between group">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="rounded text-vinted focus:ring-vinted"
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                  
                  {isAdmin && (
                    <div className="hidden group-hover:flex gap-2">
                      <button onClick={() => openCategoryEditModal(cat)} className="text-blue-500 hover:text-blue-700 text-xs">✎</button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 text-xs">🗑</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-red-50 border-red-200 border p-4 rounded-md shadow-sm">
            <h3 className="font-bold text-red-800 mb-3 text-sm uppercase tracking-wider">Διαχείριση Admin</h3>
            <div className="space-y-2 flex flex-col">
              <button onClick={() => { resetProductForm(); setIsProductModalOpen(true); }} className="bg-red-600 text-white text-xs py-2 rounded-md hover:bg-red-700 font-semibold transition">
                + Νέο Προϊόν
              </button>
              <button onClick={() => { setNewCatName(''); setIsCategoryModalOpen(true); }} className="bg-gray-800 text-white text-xs py-2 rounded-md hover:bg-gray-900 font-semibold transition">
                + Νέα Κατηγορία
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">
          {new URLSearchParams(location.search).get('search') ? 'Αποτελέσματα αναζήτησης' : 'Όλα τα Προϊόντα'}
        </h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-lg py-10">Δεν βρέθηκαν προϊόντα.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="relative group h-full">
                <ProductCard product={p} />
                
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-md shadow">
                    <button onClick={() => openEditModal(p)} className="bg-blue-600 text-white text-[11px] px-2 py-1 rounded hover:bg-blue-700 font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-600 text-white text-[11px] px-2 py-1 rounded hover:bg-red-700 font-medium">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {(isCategoryModalOpen || isCategoryEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form onSubmit={isCategoryEditModalOpen ? handleUpdateCategory : handleAddCategory} className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">{isCategoryEditModalOpen ? 'Επεξεργασία Κατηγορίας' : 'Προσθήκη Νέας Κατηγορίας'}</h3>
            <input 
              type="text" required placeholder="Όνομα Κατηγορίας" value={newCatName} onChange={e => setNewCatName(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vinted text-sm"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setIsCategoryModalOpen(false); setIsCategoryEditModalOpen(false); }} className="px-4 py-2 text-sm text-gray-500 hover:underline">Ακύρωση</button>
              <button type="submit" className="bg-vinted text-white px-4 py-2 rounded-md text-sm hover:bg-vintedHover">Αποθήκευση</button>
            </div>
          </form>
        </div>
      )}

      {(isProductModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form onSubmit={isEditModalOpen ? handleUpdateProduct : handleAddProduct} className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">{isEditModalOpen ? 'Επεξεργασία Προϊόντος' : 'Προσθήκη Νέου Προϊόντος'}</h3>
            <input 
              type="text" required placeholder="Όνομα Προϊόντος" value={newProdName} onChange={e => setNewProdName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vinted"
            />
            <input 
              type="number" step="0.01" required placeholder="Τιμή (€)" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vinted"
            />
            <input 
              type="text" placeholder="URL Εικόνας (προαιρετικά)" value={newProdImageUrl} onChange={e => setNewProdImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-vinted"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορίες Προϊόντος</label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2 bg-gray-50">
                {categories.map(c => (
                  <label key={c.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newProdCatIds.includes(c.id)} 
                      onChange={() => handleFormCategoryToggle(c.id)}
                      className="rounded text-vinted focus:ring-vinted"
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => { setIsProductModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2 text-sm text-gray-500 hover:underline">Ακύρωση</button>
              <button type="submit" className="bg-vinted text-white px-4 py-2 rounded-md text-sm hover:bg-vintedHover">Αποθήκευση</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Home;