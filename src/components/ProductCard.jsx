import React, { useState } from "react";

const ProductCard = ({ product, addToCart }) => {
  const originalPrice = Math.round(product.price / (1 - product.discountPercentage / 100));
  const discountedPrice = product.price;
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const currentImage = images[imageIndex];

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="border rounded-lg p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={currentImage}
          alt={product.title}
          className="w-full h-56 md:h-48 object-cover object-center rounded mb-4"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
            >
              ›
            </button>
          </>
        )}
      </div>
      <h3 className="text-cyan-400 text-sm md:text-lg font-semibold mb-1">{product.title}</h3>
      <p className="text-gray-600 text-xs mb-1">{product.brand}</p>
      <p className="text-gray-400 text-xs md:text-sm mb-2 line-clamp-2">{product.description}</p>
      <div className="flex items-center mb-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
        <span className="text-gray-600 text-xs ml-1">({product.rating})</span>
      </div>
      <div className="mb-4">
        <p className="text-lg md:text-xl font-bold text-blue-400">₹{discountedPrice}</p>
        {product.discountPercentage > 0 && (
          <p className="text-sm text-gray-500 line-through">₹{originalPrice}</p>
        )}
        <p className="text-xs text-green-600">Save {product.discountPercentage}%</p>
      </div>
      <button
        onClick={() => addToCart(product)}
        className="w-full bg-cyan-800 text-cyan-400 py-2 px-4 rounded hover:bg-cyan-900 transition-colors text-sm md:text-base"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
