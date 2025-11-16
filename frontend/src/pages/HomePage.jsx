// HomePage.jsx - ОБНОВЛЕННАЯ СТРУКТУРА
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";
import { apiService } from "../services/api";
import SpecialOffers from "../components/SpecialOffers";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [categoriesData, productsData] = await Promise.all([
        apiService.getMainCategories({
          mockData: [
            { id: 1, name: "Платья", slug: "dresses" },
            { id: 2, name: "Верхняя одежда", slug: "outerwear" },
            { id: 3, name: "Футболки и топы", slug: "tops" },
            { id: 4, name: "Джинсы", slug: "jeans" },
            { id: 5, name: "Обувь", slug: "shoes" },
            { id: 6, name: "Аксессуары", slug: "accessories" },
          ],
        }),
        apiService.getProducts({
          is_featured: true,
          mockData: [
            {
              id: 101,
              name: "Платье миди с цветочным принтом",
              slug: "floral-midi-dress",
              price: 4599,
              is_available: true,
              category_name: "Платья",
              average_rating: 4.8,
              review_count: 124,
            },
            {
              id: 102,
              name: "Кожаная куртка байкерская",
              slug: "biker-leather-jacket",
              price: 12999,
              is_available: true,
              category_name: "Верхняя одежда",
              average_rating: 4.9,
              review_count: 89,
            },
          ],
        }),
      ]);
      setCategories(categoriesData);
      setProducts(productsData.results || productsData);
    } catch (err) {
      setError("Ошибка загрузки данных");
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ГЕРОЙ-БАННЕР ВСТРАИВАЕМ ПРЯМО В КОМПОНЕНТ
  const HeroBanner = () => (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white overflow-hidden mb-16">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div 
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Новая коллекция<br/>
              <span className="text-fashion-pink">Весна-Лето 2024</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
              Откройте для себя последние тренды в мире моды
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => navigate('/catalog')}
                className="bg-fashion-pink text-white px-6 py-3 rounded-full font-semibold hover:bg-fashion-pink-dark transition-colors shadow-lg"
              >
                Смотреть коллекцию
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // КОЛЛЕКЦИИ ВСТРАИВАЕМ ПРЯМО В КОМПОНЕНТ
  const FashionCollections = () => {
    const collections = [
      {
        id: 1,
        title: "Вечерние платья",
        description: "Для особых случаев",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "dresses"
      },
      {
        id: 2,
        title: "Повседневный стиль",
        description: "Уют и комфорт",
        image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "tops"
      },
      {
        id: 3,
        title: "Деловой образ",
        description: "Элегантность в офисе",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "outerwear"
      }
    ];

    return (
      <section className="my-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Коллекции
          </h2>
          <p className="text-gray-600">
            Подберите образ для любого случая
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div 
              key={collection.id} 
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              onClick={() => navigate(`/catalog/${collection.category}`)}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-gray-200 text-sm">{collection.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* ГЕРОЙ-БАННЕР */}
        <HeroBanner />
        
        {/* НАВИГАЦИЯ С НОВЫМ ФОНОМ */}
        <div className="bg-dark-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navigation />
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ */}
          <SpecialOffers />

          {/* КАТЕГОРИИ В НОВОМ СТИЛЕ */}
          <section className="my-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Категории
              </h2>
              <p className="text-gray-600">
                Откройте для себя наши коллекции в каждом стиле
              </p>
            </div>
            <CategoryList
              categories={categories}
              onCategorySelect={setSelectedCategory}
            />
          </section>

          {/* КОЛЛЕКЦИИ */}
          <FashionCollections />

          {/* ПОПУЛЯРНЫЕ ТОВАРЫ */}
          <section className="my-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCategory ? selectedCategory.name : "Популярное сейчас"}
                </h2>
                <p className="text-gray-600">
                  {selectedCategory ? "Товары категории" : "Самые востребованные товары"}
                </p>
              </div>
              {!selectedCategory && (
                <button 
                  onClick={() => navigate('/catalog')}
                  className="text-fashion-pink hover:text-fashion-pink-dark font-semibold border-b-2 border-fashion-pink pb-1"
                >
                  Смотреть всё →
                </button>
              )}
            </div>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="mb-6 text-sm px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ← Показать все товары
              </button>
            )}

            {/* СЕТКА ТОВАРОВ */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => console.log(`Added ${product.name} to cart`)}
                  />
                ))}
              </div>
            )}

            {!isLoading && products.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">Товары не найдены</p>
              </div>
            )}
          </section>
        </main>
      </div>

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
        .text-fashion-pink-dark {
          color: #DB2777;
        }
        .border-fashion-pink {
          border-color: #EC4899;
        }
      `}</style>
    </>
  );
};

export default HomePage;