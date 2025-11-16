// ProductCard.jsx - ОБНОВЛЕННЫЙ ДИЗАЙН
import { useNavigate } from "react-router-dom";

const mediaUrl = "http://localhost:8000/";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const imageUrl = product.primary_image?.image || product.images?.[0]?.image_url || "media/products/no-photo.png";

  const rating = product.average_rating || 0;

  return (
    <article
      className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
      onClick={handleProductClick}
    >
      {/* КВАДРАТНОЕ ИЗОБРАЖЕНИЕ ДЛЯ ОДЕЖДЫ */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={mediaUrl + imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* БЕЙДЖИ */}
        <div className="absolute top-3 left-3 space-y-1">
          {!product.is_available && (
            <span className="bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Нет в наличии
            </span>
          )}
          {product.is_featured && (
            <span className="bg-fashion-pink text-white text-xs font-bold px-2 py-1 rounded-full">
              Хит
            </span>
          )}
          {product.is_new && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Новинка
            </span>
          )}
        </div>

        {/* КНОПКА БЫСТРОГО ДОБАВЛЕНИЯ */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-fashion-pink hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        {/* КАТЕГОРИЯ */}
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          {product.category_name || "Одежда"}
        </p>
        
        {/* НАЗВАНИЕ */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* РЕЙТИНГ */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 text-sm">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({product.review_count || 0})
          </span>
        </div>

        {/* ЦЕНА И КНОПКА */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {parseFloat(product.price).toLocaleString("ru-RU")} ₽
          </span>

          <button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              product.is_available
                ? "bg-gray-900 text-white hover:bg-fashion-pink"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {product.is_available ? "В корзину" : "Нет в наличии"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;