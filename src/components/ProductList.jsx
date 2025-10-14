import React from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

const ProductList = ({ products = [], isLoading = false }) => {
  const { addToCart } = useCart();

  // 🟢 Loading state (skeletons)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse border rounded p-4 shadow space-y-3"
          >
            <div className="bg-gray-300 h-40 w-full rounded"></div>
            <div className="bg-gray-300 h-5 w-3/4 rounded"></div>
            <div className="bg-gray-300 h-5 w-1/2 rounded"></div>
            <div className="bg-gray-300 h-8 w-24 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // 🟢 Empty state
  if (!products.length) {
    return (
      <div className="flex flex-col justify-center items-center py-16 text-center">
        <p className="text-gray-500 text-lg">No products available</p>
        <p className="text-sm text-gray-400 mt-1">
          Please check back later or try adjusting your filters.
        </p>
      </div>
    );
  }

  // 🟢 Product Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          addToCart={() => addToCart(product)}
        />
      ))}
    </div>
  );
};

export default ProductList;
