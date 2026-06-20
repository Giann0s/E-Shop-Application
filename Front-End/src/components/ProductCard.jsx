import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} state={{ product }} className="flex flex-col group bg-white p-2 rounded-md shadow-sm hover:shadow-md transition-shadow h-full w-full">
      
      <div className="w-full h-64 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-400 text-center px-4 w-full">
            <span className="text-sm font-medium block truncate">{product.name}</span>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-bold text-lg">{product.price.toFixed(2)} €</h3>
          <p className="text-gray-500 text-sm truncate">{product.name}</p>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {product.categories.map((cat, idx) => (
            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">
              {cat}
            </span>
          ))}
        </div>
      </div>
      
    </Link>
  );
};

export default ProductCard;