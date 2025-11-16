// AccessibilityWidget.jsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React, { useState, useEffect } from "react";

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("accessibility-fontSize");
    return saved ? parseInt(saved) : 100;
  });
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem("accessibility-highContrast");
    return saved === "true";
  });
  const [grayscale, setGrayscale] = useState(() => {
    const saved = localStorage.getItem("accessibility-grayscale");
    return saved === "true";
  });

  // Сохраняем настройки в localStorage
  useEffect(() => {
    localStorage.setItem("accessibility-fontSize", fontSize.toString());
    localStorage.setItem("accessibility-highContrast", highContrast.toString());
    localStorage.setItem("accessibility-grayscale", grayscale.toString());
  }, [fontSize, highContrast, grayscale]);

  // Применяем настройки доступности к документу
  useEffect(() => {
    // Размер шрифта
    document.documentElement.style.fontSize = `${fontSize}%`;

    // Высокая контрастность - добавляем класс к body
    if (highContrast) {
      document.body.classList.add("high-contrast-mode");
    } else {
      document.body.classList.remove("high-contrast-mode");
    }

    // Оттенки серого - добавляем класс к body
    if (grayscale) {
      document.body.classList.add("grayscale-mode");
    } else {
      document.body.classList.remove("grayscale-mode");
    }
  }, [fontSize, highContrast, grayscale]);

  // Сброс всех настроек
  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setGrayscale(false);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  const handleContrastToggle = () => {
    setHighContrast(!highContrast);
  };

  const handleGrayscaleToggle = () => {
    setGrayscale(!grayscale);
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 200));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 50));
  };

  return (
    <>
      {/* Стили для режимов - БЕЗ ПЕРЕОПРЕДЕЛЕНИЯ ПОЗИЦИОНИРОВАНИЯ */}
      <style jsx global>{`
        /* Основные стили для режимов доступности */
        .high-contrast-mode {
          filter: contrast(180%);
          background-color: #000 !important;
          color: #fff !important;
        }
        
        .high-contrast-mode .bg-white,
        .high-contrast-mode .bg-gray-50,
        .high-contrast-mode .bg-slate-50 {
          background-color: #000 !important;
          color: #fff !important;
        }
        
        .high-contrast-mode .text-gray-900,
        .high-contrast-mode .text-slate-900,
        .high-contrast-mode .text-gray-700 {
          color: #fff !important;
        }
        
        .high-contrast-mode .text-gray-600,
        .high-contrast-mode .text-slate-600 {
          color: #ccc !important;
        }
        
        .high-contrast-mode img:not(.accessibility-exclude) {
          filter: brightness(1.1) contrast(1.05);
        }
        
        .grayscale-mode {
          filter: grayscale(100%);
        }
        
        .grayscale-mode .text-fashion-pink:not(.accessibility-exclude),
        .grayscale-mode .text-amber-600:not(.accessibility-exclude) {
          color: #666 !important;
        }
        
        /* ВАЖНО: Исключаем только сам виджет из фильтров, не трогая позиционирование */
        .accessibility-widget-button,
        .accessibility-widget-panel {
          filter: none !important;
        }
        
        .high-contrast-mode .accessibility-widget-button,
        .high-contrast-mode .accessibility-widget-panel,
        .grayscale-mode .accessibility-widget-button,
        .grayscale-mode .accessibility-widget-panel {
          filter: none !important;
        }
        
        /* Исключаем внутренние элементы виджета из стилей контрастности */
        .high-contrast-mode .accessibility-exclude,
        .high-contrast-mode .accessibility-exclude * {
          background-color: initial !important;
          color: initial !important;
          border-color: initial !important;
        }
      `}</style>
      
      {/* Плавающая кнопка - ТОЛЬКО ФИЛЬТР ИСКЛЮЧЕН */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accessibility-widget-button fixed bottom-6 right-6 z-50 p-4 bg-fashion-pink text-white rounded-full shadow-2xl shadow-fashion-pink/50 hover:bg-fashion-pink-dark transition-all focus:outline-none focus:ring-4 focus:ring-fashion-pink"
        aria-label="Настройки доступности"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </button>

      {/* Панель настроек - ТОЛЬКО ФИЛЬТР ИСКЛЮЧЕН */}
      <div
        className={`accessibility-widget-panel fixed bottom-0 right-0 z-40 bg-gray-800 p-8 w-full sm:w-80 h-auto sm:h-auto rounded-t-3xl shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="accessibility-widget-label"
      >
        <div className="accessibility-exclude flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h3
            id="accessibility-widget-label"
            className="text-xl font-bold text-white"
          >
            Настройки доступности
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors"
            aria-label="Закрыть панель"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        <div className="accessibility-exclude space-y-6">
          {/* Размер шрифта */}
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-white">
              Размер шрифта ({fontSize}%)
            </h4>
            <div className="flex items-center space-x-3">
              <button
                onClick={decreaseFontSize}
                className="w-10 h-10 bg-gray-700 text-white rounded-full text-xl font-bold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors"
                aria-label="Уменьшить шрифт"
              >
                A-
              </button>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-fashion-pink"
              />
              <button
                onClick={increaseFontSize}
                className="w-10 h-10 bg-gray-700 text-white rounded-full text-xl font-bold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors"
                aria-label="Увеличить шрифт"
              >
                A+
              </button>
            </div>
          </div>

          {/* Высокая контрастность */}
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-white">
              Высокая контрастность
            </span>
            <button
              onClick={handleContrastToggle}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-fashion-pink ${
                highContrast ? 'bg-fashion-pink' : 'bg-gray-600'
              }`}
              aria-label="Высокая контрастность"
              aria-checked={highContrast}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>
          
          {/* Оттенки серого */}
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-white">
              Оттенки серого
            </span>
            <button
              onClick={handleGrayscaleToggle}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-fashion-pink ${
                grayscale ? 'bg-fashion-pink' : 'bg-gray-600'
              }`}
              aria-label="Оттенки серого"
              aria-checked={grayscale}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${
                  grayscale ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Кнопка сброса */}
        <div className="accessibility-exclude pt-6 mt-6 border-t border-gray-700">
          <button
            onClick={resetSettings}
            className="w-full py-3 text-sm font-semibold text-fashion-pink border border-fashion-pink rounded-full hover:bg-fashion-pink hover:text-white focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors"
            aria-label="Сбросить настройки доступности"
          >
            Сбросить настройки
          </button>
        </div>
      </div>
    </>
  );
};

export default AccessibilityWidget;