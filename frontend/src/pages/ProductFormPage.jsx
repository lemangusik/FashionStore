// ProductFormPage.jsx - ОБНОВЛЕННЫЕ ЦВЕТА
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { apiService } from "../services/api";
import { userProfile } from "../data/mockData";

const ProductFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(slug);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: 0,
    warranty_months: 0,
    is_available: true,
    is_featured: false,
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    loadFormData();
  }, [slug]);

  const loadFormData = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        apiService.getAllCategories({
          mockData: [
            { id: 1, name: "Платья" },
            { id: 2, name: "Верхняя одежда" },
            { id: 3, name: "Футболки и топы" },
            { id: 4, name: "Джинсы" },
            { id: 5, name: "Обувь" },
          ],
        }),
        apiService.getBrands({
          mockData: [
            { id: 10, name: "Zara" },
            { id: 11, name: "H&M" },
            { id: 12, name: "Massimo Dutti" },
            { id: 13, name: "Bershka" },
          ],
        }),
      ]);

      setCategories(categoriesData);
      setBrands(brandsData);

      if (isEditing) {
        const productData = await apiService.getProduct(slug);
        setFormData({
          name: productData.name,
          slug: productData.slug,
          description: productData.description || "",
          category: productData.category.id || productData.category,
          brand: productData.brand?.id || productData.brand || "",
          price: productData.price,
          stock: productData.stock,
          warranty_months: productData.warranty_months,
          is_available: productData.is_available,
          is_featured: productData.is_featured,
        });
      }
    } catch (err) {
      setError("Ошибка загрузки данных");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.slug || !formData.price || !formData.category) {
      setError("Пожалуйста, заполните все обязательные поля (Название, SLUG, Цена, Категория).");
      return;
    }

    const dataToSend = {
      ...formData,
      category: parseInt(formData.category, 10),
      brand: formData.brand ? parseInt(formData.brand, 10) : null,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      warranty_months: parseInt(formData.warranty_months, 10),
    };

    try {
      setIsLoading(true);
      if (isEditing) {
        await apiService.updateProduct(slug, dataToSend);
      } else {
        await apiService.createProduct(dataToSend);
      }

      setIsSubmitted(true);
      navigate("/catalog", { replace: true });
    } catch (err) {
      console.error("Product submission error:", err);
      if (err.response && err.response.data) {
        const apiError = err.response.data;
        setError(
          apiError.slug
            ? `Ошибка SLUG: ${apiError.slug[0]}`
            : apiError.detail
            ? apiError.detail
            : "Ошибка при сохранении продукта. Проверьте данные."
        );
      } else {
        setError("Произошла неизвестная ошибка при сохранении продукта.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* ОБНОВЛЕННЫЙ ФОН */}
      <div className="bg-dark-charcoal py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEditing ? "Редактировать товар" : "Создать новый товар"}
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          {error && (
            <div
              className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* НАЗВАНИЕ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название товара *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                placeholder="Введите название товара (например, Платье миди с цветочным принтом)"
              />
            </div>

            {/* SLUG */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SLUG *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                placeholder="slug-tovara-unikalnoe-imya"
                disabled={isEditing}
              />
              {isEditing && (
                <p className="mt-1 text-xs text-gray-500">
                  SLUG нельзя изменить для существующего товара.
                </p>
              )}
            </div>

            {/* ОПИСАНИЕ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                placeholder="Подробное описание товара"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* КАТЕГОРИЯ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* БРЕНД */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Бренд
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                >
                  <option value="">Выберите бренд (Необязательно)</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ЦЕНА */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                  placeholder="0.00"
                />
              </div>

              {/* ЗАПАС */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Запас (шт.) *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                  placeholder="0"
                />
              </div>

              {/* ГАРАНТИЯ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Гарантия (мес.)
                </label>
                <input
                  type="number"
                  name="warranty_months"
                  value={formData.warranty_months}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fashion-pink focus:border-transparent transition-colors"
                  placeholder="0"
                />
              </div>
            </div>

            {/* ЧЕКБОКСЫ */}
            <div className="flex space-x-6 pt-4">
              <div className="flex items-center">
                <input
                  id="is_available"
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="w-4 h-4 text-fashion-pink border-gray-300 rounded focus:ring-fashion-pink"
                />
                <label
                  htmlFor="is_available"
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  Доступен для продажи
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="is_featured"
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-fashion-pink border-gray-300 rounded focus:ring-fashion-pink"
                />
                <label
                  htmlFor="is_featured"
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  Показывать на главной
                </label>
              </div>
            </div>

            {/* КНОПКИ */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-fashion-pink text-white rounded-xl hover:bg-fashion-pink-dark disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors font-medium"
              >
                {isLoading
                  ? "Сохранение..."
                  : isEditing
                  ? "Обновить товар"
                  : "Создать товар"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* ОБНОВЛЕННЫЕ СТИЛИ */}
      <style jsx>{`
        .bg-dark-charcoal {
          background-color: #2C2C2C;
        }
        .bg-fashion-pink {
          background-color: #EC4899;
        }
        .bg-fashion-pink-dark {
          background-color: #DB2777;
        }
        .text-fashion-pink {
          color: #EC4899;
        }
        .focus\\:ring-fashion-pink:focus {
          --tw-ring-color: #EC4899;
        }
      `}</style>
    </div>
  );
};

export default ProductFormPage;