// Header.jsx - ОБНОВЛЕННЫЙ ДИЗАЙН
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";
import CartModal from "./CartModal";

const Header = ({ onProfileClick }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    isLoggedIn: false,
    name: "",
    avatar: "",
    isStaff: false,
  });
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Mock functions (сохранены)
  const apiService = {
      checkAuthStatus: () => {
          const token = localStorage.getItem("authToken");
          const userData = localStorage.getItem("user");
          if (token && userData) {
              const user = JSON.parse(userData);
              setUserProfile({
                  isLoggedIn: true,
                  name: user.username || "Пользователь",
                  avatar: user.avatar || null,
                  isStaff: user.isStaff || false,
              });
          }
      },
      logout: () => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setUserProfile({ isLoggedIn: false, name: "", avatar: "", isStaff: false });
          setCartItemsCount(0);
      },
      loadCartCount: () => {
        setCartItemsCount(2); 
      },
      login: async (username, password) => {
          console.log(`Attempting login for ${username}`);
          const mockUser = { username: "testuser", isStaff: false, avatar: "" };
          localStorage.setItem("authToken", "mock-token-123");
          localStorage.setItem("user", JSON.stringify(mockUser));
          setUserProfile({ isLoggedIn: true, name: mockUser.username, avatar: mockUser.avatar, isStaff: mockUser.isStaff });
          return true;
      },
      register: async (data) => {
          console.log(`Attempting registration for ${data.username}`);
          const mockUser = { username: data.username, isStaff: false, avatar: "" };
          localStorage.setItem("authToken", "mock-token-456");
          localStorage.setItem("user", JSON.stringify(mockUser));
          setUserProfile({ isLoggedIn: true, name: mockUser.username, avatar: mockUser.avatar, isStaff: mockUser.isStaff });
          return true;
      }
  };

  useEffect(() => {
    apiService.checkAuthStatus();
    const handleOpenAuthModal = () => setIsAuthModalOpen(true);
    window.addEventListener("openAuthModal", handleOpenAuthModal);
    return () => {
      window.removeEventListener("openAuthModal", handleOpenAuthModal);
    };
  }, []);

  useEffect(() => {
    if (userProfile.isLoggedIn) {
      apiService.loadCartCount();
    } else {
      setCartItemsCount(0);
    }
  }, [userProfile.isLoggedIn]);

  const handleLogout = () => {
    apiService.logout();
  };

  const handleProfileClick = () => {
    if (userProfile.isLoggedIn) {
      if (onProfileClick) {
        onProfileClick();
      }
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogin = (username, password) => apiService.login(username, password);
  const handleRegister = (data) => apiService.register(data);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* ЛОГОТИП С НОВЫМ СТИЛЕМ */}
            <Link to="/" className="flex-shrink-0 group">
              <span className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-fashion-pink transition-colors">
                Fashion<span className="text-fashion-pink">Store</span>
              </span>
            </Link>

            {/* ПОИСКОВАЯ СТРОКА */}
            <div className="hidden lg:block flex-1 mx-8 max-w-xl">
              <SearchBar />
            </div>

            {/* ИКОНКИ ДЕЙСТВИЙ */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* КОРЗИНА */}
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="relative p-3 rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-fashion-pink group"
                aria-label={`Корзина, ${cartItemsCount} товаров`}
              >
                <svg
                  className="w-6 h-6 text-gray-700 group-hover:text-fashion-pink transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m9 3.5a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-fashion-pink text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md border-2 border-white">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </button>

              {/* ПРОФИЛЬ / ВХОД */}
              {userProfile.isLoggedIn ? (
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-fashion-pink p-2 rounded-full hover:bg-pink-50 transition-colors focus:outline-none focus:ring-4 focus:ring-fashion-pink"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt="Аватар пользователя"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      userProfile.name[0].toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {userProfile.name}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2 bg-gray-900 text-white font-medium rounded-full hover:bg-fashion-pink transition-colors focus:outline-none focus:ring-4 focus:ring-fashion-pink shadow-lg"
                >
                  Войти
                </button>
              )}

              {/* ВЫХОД */}
              {userProfile.isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Выход
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* МОДАЛЬНЫЕ ОКНА */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </>
  );
};

export default Header;