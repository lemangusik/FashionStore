// AuthModal.jsx - ОБНОВЛЕННЫЙ ДИЗАЙН
import React, { useState } from "react";

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      password2: "",
      first_name: "",
      last_name: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Имя пользователя обязательно";
    } else if (formData.username.length < 3) {
      newErrors.username = "Имя пользователя должно быть не менее 3 символов";
    }

    if (!isLogin) {
      if (!formData.email) {
        newErrors.email = "Email обязателен";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Некорректный формат email";
      }
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    }
    
    if (!isLogin && formData.password !== formData.password2) {
      newErrors.password2 = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      let success = false;
      if (isLogin) {
        success = await onLogin(formData.username, formData.password); 
      } else {
        success = await onRegister(formData);
      }

      if (success) {
        onClose();
      } else {
         setErrors({ submit: isLogin ? "Неверное имя пользователя или пароль." : "Ошибка регистрации. Возможно, пользователь уже существует." });
      }

    } catch (err) {
      setErrors({ submit: "Произошла ошибка сети или сервера." });
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", required = false }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-fashion-pink transition-shadow text-gray-900 ${
          errors[name] ? "border-red-500" : "border-gray-300 focus:border-fashion-pink"
        }`}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white p-8 sm:p-10">
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-3xl font-bold text-gray-900"
                id="modal-title"
              >
                {isLogin ? "Вход в аккаунт" : "Регистрация"}
              </h3>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-fashion-pink transition-colors"
                onClick={onClose}
                aria-label="Закрыть"
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
            
            {errors.submit && (
                <div className={`p-4 mb-4 text-sm rounded-xl ${errors.submit.includes('успешна') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
                    {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Имя пользователя"
                name="username"
                required
              />
              {!isLogin && (
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  required
                />
              )}
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="Имя"
                        name="first_name"
                    />
                    <InputField
                        label="Фамилия"
                        name="last_name"
                    />
                </div>
              )}
              <InputField
                label="Пароль"
                name="password"
                type="password"
                required
              />
              {!isLogin && (
                <InputField
                  label="Повторите пароль"
                  name="password2"
                  type="password"
                  required
                />
              )}

              {/* КНОПКА ОТПРАВКИ */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-fashion-pink text-white py-3 px-4 rounded-xl font-bold text-lg hover:bg-fashion-pink-dark focus:outline-none focus:ring-4 focus:ring-fashion-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isLogin ? "Вход..." : "Регистрация..."}
                  </div>
                ) : isLogin ? (
                  "Войти"
                ) : (
                  "Зарегистрироваться"
                )}
              </button>

              {/* ПЕРЕКЛЮЧЕНИЕ РЕЖИМА */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Еще нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-fashion-pink hover:text-fashion-pink-dark font-semibold focus:outline-none focus:ring-2 focus:ring-fashion-pink rounded transition-colors"
                  >
                    {isLogin ? "Создать аккаунт" : "Войти"}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;