// CartModal.jsx - ОБНОВЛЕННЫЙ ДИЗАЙН
import React, { useState, useEffect } from "react";

// Mock API
const apiService = {
  getCart: async () => ({
    id: 1,
    total_price: 139000,
    items: [
      {
        id: 101,
        product: { id: 1, name: "Платье миди с цветочным принтом", price: 99000, slug: "floral-dress", primary_image: { image: "media/mock/dress.jpg" } },
        quantity: 1,
        total_price: 99000,
      },
      {
        id: 102,
        product: { id: 3, name: "Кожаная куртка", price: 12000, slug: "leather-jacket", primary_image: { image: "media/mock/jacket.jpg" } },
        quantity: 2,
        total_price: 24000,
      },
    ],
  }),
  updateCartItem: (itemId, quantity) => {
      console.log(`Updated item ${itemId} quantity to ${quantity}`);
      return true;
  },
  removeCartItem: (itemId) => {
      console.log(`Removed item ${itemId}`);
      return true;
  },
  checkout: () => {
      console.log("Checkout initiated");
      return true;
  },
};

const CartModal = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mediaUrl = "http://localhost:8000/";

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Для просмотра корзины необходимо войти в систему");
        return;
      }

      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (err) {
      console.error("Error loading cart:", err);
      if (err.message && (err.message.includes("403") || err.message.includes("401"))) {
        setError("Ошибка авторизации. Пожалуйста, войдите снова.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } else {
        setError("Ошибка загрузки корзины");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    const updatedItems = cart.items.map((i) =>
      i.id === itemId ? { ...i, quantity: newQuantity } : i
    );
    setCart({ ...cart, items: updatedItems, total_price: calculateTotal(updatedItems) });
    
    try {
      await apiService.updateCartItem(itemId, newQuantity);
    } catch (err) {
      console.error("Error updating cart item:", err);
      loadCart();
    }
  };

  const removeItem = async (itemId) => {
    const updatedItems = cart.items.filter((i) => i.id !== itemId);
    setCart({ ...cart, items: updatedItems, total_price: calculateTotal(updatedItems) });

    try {
      await apiService.removeCartItem(itemId);
    } catch (err) {
      console.error("Error removing cart item:", err);
      loadCart();
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    apiService.checkout();
    onClose();
    console.log("Proceeding to checkout...");
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity ${
        isOpen ? "opacity-100 bg-gray-900/70" : "opacity-0 pointer-events-none"
      }`}
      aria-labelledby="cart-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-end min-h-screen">
        <div
          className={`w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="document"
        >
          <div className="flex flex-col h-full">
            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3
                className="text-2xl font-bold text-gray-900"
                id="cart-modal-title"
              >
                🛒 Ваша корзина
              </h3>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-fashion-pink transition-colors"
                onClick={onClose}
                aria-label="Закрыть корзину"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-grow p-6 overflow-y-auto">
              {isLoading && (
                <div className="text-center py-10 text-gray-500">
                  Загрузка корзины...
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl mb-4">
                  <p className="font-semibold mb-2">{error}</p>
                  {error.includes("войти") && (
                    <button 
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-fashion-pink transition-colors" 
                      onClick={() => { onClose(); window.dispatchEvent(new Event('openAuthModal')); }}
                    > 
                      Войти
                    </button>
                  )}
                </div>
              )}

              {cart && cart.items && cart.items.length > 0 && (
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={mediaUrl + (item.product.primary_image?.image || "media/products/no-photo.png")}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.product.price.toLocaleString('ru-RU')} ₽ / шт.
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-6 h-6 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                              aria-label="Уменьшить количество"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium text-gray-900 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-6 h-6 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                              aria-label="Увеличить количество"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right">
                             <p className="text-lg font-bold text-gray-900">
                                {item.total_price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                         <button
                            onClick={() => removeItem(item.id)}
                            className="mt-1 text-red-600 hover:text-red-800 text-xs font-medium transition-colors"
                          >
                            Удалить
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart && cart.items && cart.items.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium text-gray-500 mb-4">
                    Ваша корзина пуста 😔
                  </p>
                  <p className="text-gray-600 mb-6">
                    Добавьте товары из нашего каталога
                  </p>
                  <button
                    onClick={() => { onClose(); window.location.href = '/catalog'; }}
                    className="bg-fashion-pink text-white px-6 py-3 rounded-lg hover:bg-fashion-pink-dark transition-colors"
                  >
                    Перейти в каталог
                  </button>
                </div>
              )}
            </div>

            {/* FOOTER */}
            {cart && cart.items && cart.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50 sticky bottom-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-700">Итого:</span>
                  <span className="text-3xl font-bold text-fashion-pink">
                    {cart.total_price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-bold text-lg hover:bg-fashion-pink transition-colors focus:outline-none focus:ring-4 focus:ring-fashion-pink shadow-lg"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;