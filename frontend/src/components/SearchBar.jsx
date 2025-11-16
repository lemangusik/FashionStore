// SearchBar.jsx - ОБНОВЛЕННЫЙ ДИЗАЙН
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} role="search" method="get">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Поиск товаров
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Поиск платьев, курток, обуви..."
          className="w-full pl-12 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-fashion-pink focus:border-fashion-pink transition-shadow text-base"
          aria-describedby="search-description"
        />
        
        {/* ИКОНКА ЛУПЫ */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;