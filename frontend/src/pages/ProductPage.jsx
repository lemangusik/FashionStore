/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { apiService } from "../services/api";
import { userProfile } from "../data/mockData";

// Вспомогательный компонент для сводки оценок
const RatingSummary = ({ reviews }) => {
  const ratingDistribution = [0, 0, 0, 0, 0];
  let totalReviews = reviews.length;
  let averageRating = 0;

  if (totalReviews > 0) {
    reviews.forEach((review) => {
      ratingDistribution[5 - review.rating]++;
    });
    averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  }

  const ratingBars = [5, 4, 3, 2, 1].map((star, index) => {
    const count = ratingDistribution[5 - star];
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return (
      <div key={star} className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 w-3">
          {star}★
        </span>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="bg-fashion-pink h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-500 w-8 text-right">
          {count}
        </span>
      </div>
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Сводка оценок
      </h3>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 min-w-[150px]">
          <div className="text-5xl font-extrabold text-fashion-pink mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex text-yellow-400 text-2xl mb-2">
            {"★".repeat(Math.floor(averageRating))}
            {"☆".repeat(5 - Math.floor(averageRating))}
          </div>
          <div className="text-sm font-medium text-gray-600">
            на основе {totalReviews} отзывов
          </div>
        </div>

        <div className="flex-1 space-y-2 w-full max-w-sm">
          {ratingBars}
        </div>
      </div>
    </div>
  );
};

// Вспомогательный компонент для одного отзыва
const ReviewItem = ({ review }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-fashion-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(review.user_name || review.user_email || 'П').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{review.user_name || review.user_email || 'Пользователь'}</p>
            <p className="text-xs text-gray-500">
              {new Date(review.created_at || review.date).toLocaleDateString("ru-RU")}
            </p>
          </div>
        </div>
        <div className="flex text-yellow-400 text-xl flex-shrink-0" aria-label={`Оценка: ${review.rating} из 5 звезд`}>
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
      </div>

      <p className="text-gray-800 text-base leading-relaxed mb-4">
        {review.comment || review.text}
      </p>

      {review.admin_response && (
        <div className="mt-4 p-4 bg-gray-50 border-l-4 border-gray-300 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-gray-700">Ответ магазина:</span>
            <span className="text-xs font-medium text-fashion-pink">Проверенный аккаунт</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">{review.admin_response}</p>
        </div>
      )}
    </div>
  );
};

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    loadProductData();
  }, [slug]);

  const loadProductData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const productData = await apiService.getProduct(slug);
      setProduct(productData);

      // Загрузка отзывов
      await loadReviews(productData.id);
    } catch (err) {
      setError("Ошибка загрузки данных продукта");
      console.error("Error loading product data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async (productId) => {
    try {
      // Используем API для получения отзывов
      const reviewsData = await apiService.request(`/products/${productId}/reviews`);
      setReviews(reviewsData.results || reviewsData || []);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
    }
  };

  // Функция для получения правильного URL изображения
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "http://localhost:8000/media/products/no-photo.png";

    // Если URL уже полный (начинается с http), возвращаем как есть
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Если это относительный путь, добавляем базовый URL
    return `http://localhost:8000${imagePath}`;
  };

  const handleAddToCart = () => {
    if (product.is_available) {
      console.log(`Added ${product.name} to cart`);
      // Здесь можно добавить вызов API для добавления в корзину
    }
  };

  const handleEditProduct = () => {
    navigate(`/product/edit/${product.slug}`);
  };

  const handleDeleteProduct = async () => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        await apiService.deleteProduct(product.slug);
        navigate("/");
      } catch (err) {
        setError("Товар успешно удален");
        console.error("Error deleting product:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fashion-pink mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-20 bg-red-100 text-red-700 m-8 rounded-xl">
          {error || "Товар не найден"}
        </div>
      </div>
    );
  }

  // Получаем массив изображений продукта
  const productImages = product.images && product.images.length > 0
    ? product.images.map(img => getImageUrl(img.image_url))
    : [getImageUrl(null)];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-dark-charcoal shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Хлебные крошки */}
        <nav className="mb-8 text-sm font-medium text-gray-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-fashion-pink transition-colors">Главная</Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-fashion-pink transition-colors">Каталог</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </nav>

        {/* Главная секция товара */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Колонка изображений */}
            <div>
              <div className="w-full aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden mb-4">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              {/* Миниатюры */}
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${index === selectedImage
                      ? "border-fashion-pink ring-4 ring-fashion-pink/20 shadow-md"
                      : "border-gray-200 hover:border-fashion-pink"
                      }`}
                    aria-label={`Показать изображение ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - вид ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Колонка информации */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Рейтинг */}
              <div className="flex items-center space-x-3">
                <div className="flex text-yellow-400 text-xl">
                  {"★".repeat(Math.floor(product.average_rating || 0))}
                  {"☆".repeat(5 - Math.floor(product.average_rating || 0))}
                </div>
                <span className="text-gray-600 font-medium text-lg">
                  ({reviews.length} отзывов)
                </span>
              </div>

              {/* Цена */}
              <div className="py-4 border-y border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Цена:
                </p>
                <span className="text-4xl font-bold text-gray-900 block">
                  {parseFloat(product.price).toLocaleString("ru-RU")} ₽
                </span>
              </div>

              {/* Статус */}
              <div className="flex items-center space-x-6 text-sm font-medium">
                {product.is_available ? (
                  <span className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    В наличии: {product.stock} шт.
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Нет в наличии
                  </span>
                )}
              </div>

              {/* Кнопка "В корзину" */}
              <button
                onClick={handleAddToCart}
                disabled={!product.is_available}
                className={`w-full py-4 rounded-xl text-lg font-bold uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-fashion-pink transition-all shadow-lg ${product.is_available
                  ? "bg-gray-900 text-white hover:bg-fashion-pink shadow-gray-900/30"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  }`}
              >
                {product.is_available ? "Добавить в корзину" : "Нет в наличии"}
              </button>

              {/* Кнопки управления для админов */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleEditProduct}
                  className="flex-1 py-3 px-6 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Редактировать
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 py-3 px-6 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Секция вкладок */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="border-b border-gray-100 mb-6">
            <nav className="flex space-x-6 -mb-px" aria-label="Tabs">
              {[
                { id: "description", label: "Описание" },
                { id: "specs", label: "Характеристики" },
                { id: "reviews", label: `Отзывы (${reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 text-lg font-bold transition-colors focus:outline-none ${activeTab === tab.id
                    ? "border-fashion-pink text-fashion-pink"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Содержимое вкладок */}
          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose max-w-none text-gray-800">
                <p className="text-lg leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Характеристики</h4>
                <ul className="divide-y divide-gray-100 border-y border-gray-100">
                  {product.specifications?.map((spec, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <span className="text-gray-600 font-medium w-1/3">{spec.name}</span>
                      <span className="text-gray-800 font-semibold w-2/3 text-right">{spec.value}</span>
                    </li>
                  ))}
                  <li className="py-3 flex justify-between items-center">
                    <span className="text-gray-600 font-medium w-1/3">Бренд</span>
                    <span className="text-gray-800 font-semibold w-2/3 text-right">{product.brand_name || product.brand}</span>
                  </li>
                  <li className="py-3 flex justify-between items-center">
                    <span className="text-gray-600 font-medium w-1/3">Категория</span>
                    <span className="text-gray-800 font-semibold w-2/3 text-right">{product.category_name || product.category?.name}</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {reviews.length > 0 && <RatingSummary reviews={reviews} />}

                <h4 className="text-2xl font-bold text-gray-900">
                  Отзывы покупателей
                </h4>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Отзывов пока нет
                    </h3>
                    <p className="text-gray-600 text-base max-w-md mx-auto">
                      Будьте первым, кто оставит отзыв об этом товаре.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;