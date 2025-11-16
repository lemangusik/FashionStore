// CategoryList.jsx - ОБНОВЛЕННЫЙ ДИЗАЙН
import React from "react";

const CategoryList = ({ categories, onCategorySelect }) => {
  const categoryIcons = {
    "Платья": "👗",
    "Верхняя одежда": "🧥", 
    "Футболки и топы": "👚",
    "Джинсы": "👖",
    "Обувь": "👠",
    "Аксессуары": "👜"
  };

  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">
        Категории товаров
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className="flex flex-col items-center p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-fashion-pink hover:shadow-lg transition-all duration-300 group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              {categoryIcons[category.name] || "👕"}
            </span>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-fashion-pink text-center">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;