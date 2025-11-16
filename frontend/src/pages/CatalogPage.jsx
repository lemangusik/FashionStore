/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import ProductCard from "../components/ProductCard";
import { apiService } from "../services/api";
import { userProfile } from "../data/mockData";

const CatalogPage = () => {
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search") || "";

  const currentCategory = useMemo(() => categories.find((cat) => cat.slug === categorySlug), [categories, categorySlug]);
  const currentSubcategory = useMemo(() => categories.find((sub) => sub.slug === subcategorySlug), [categories, subcategorySlug]);
  
  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []); 

  useEffect(() => {
    loadProducts();
  }, [
    categorySlug,
    subcategorySlug,
    sortBy,
    priceRange,
    inStockOnly,
    selectedBrands,
    searchQuery,
    search,
  ]);

  const loadCategories = async () => {
    try {
      const categoriesData = await apiService.getAllCategories({
        mockData: [
          { id: 1, name: "Платья", slug: "dresses", parent: null },
          { id: 2, name: "Вечерние платья", slug: "evening-dresses", parent: 1 },
          { id: 3, name: "Повседневные платья", slug: "casual-dresses", parent: 1 },
          { id: 4, name: "Верхняя одежда", slug: "outerwear", parent: null },
          { id: 5, name: "Куртки", slug: "jackets", parent: 4 },
          { id: 6, name: "Пальто", slug: "coats", parent: 4 },
          { id: 7, name: "Футболки и топы", slug: "tops", parent: null },
          { id: 8, name: "Джинсы", slug: "jeans", parent: null },
          { id: 9, name: "Обувь", slug: "shoes", parent: null },
          { id: 10, name: "Аксессуары", slug: "accessories", parent: null },
        ],
      });
      setCategories(categoriesData);
    } catch (err) {
      setError("Ошибка загрузки категорий");
      console.error("Error loading categories:", err);
    }
  };
  
  const loadBrands = async () => {
    try {
      const brandsData = await apiService.getBrands({
        mockData: [
          { id: 1, name: "Zara" },
          { id: 2, name: "H&M" },
          { id: 3, name: "Massimo Dutti" },
          { id: 4, name: "Bershka" },
          { id: 5, name: "Stradivarius" },
          { id: 6, name: "Pull&Bear" },
        ],
      });
      setBrands(brandsData);
    } catch (err) {
      console.error("Error loading brands:", err);
    }
  };

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        ordering: getOrderingParam(sortBy),
        price_min: priceRange[0],
        price_max: priceRange[1],
        is_available: inStockOnly ? "true" : undefined, 
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (selectedBrands.length > 0) {
        params.brand = selectedBrands.join(",");
      }

      if (currentSubcategory) {
        params.category = currentSubcategory.id;
      } else if (currentCategory) {
        params.category = currentCategory.id;
      }

      const productsData = await apiService.getProducts({
        ...params,
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
            is_featured: true,
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
            is_featured: true,
          },
          {
            id: 103,
            name: "Футболка оверсайз белая",
            slug: "white-oversize-tshirt",
            price: 1999,
            is_available: true,
            category_name: "Футболки и топы",
            average_rating: 4.5,
            review_count: 67,
          },
          {
            id: 104,
            name: "Скинни джинсы",
            slug: "skinny-jeans",
            price: 3999,
            is_available: false,
            category_name: "Джинсы",
            average_rating: 4.3,
            review_count: 45,
          },
          {
            id: 105,
            name: "Кроссовки белые",
            slug: "white-sneakers",
            price: 5999,
            is_available: true,
            category_name: "Обувь",
            average_rating: 4.7,
            review_count: 156,
            is_featured: true,
          },
        ],
      });
      setProducts(productsData.results || productsData);
    } catch (err) {
      setError("Ошибка загрузки товаров");
      console.error("Error loading products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderingParam = (sort) => {
    switch (sort) {
      case "price-asc":
        return "price";
      case "price-desc":
        return "-price";
      case "name":
      default:
        return "name";
    }
  };

  const handleCategoryClick = (category) => {
    if (currentCategory?.id === category.id) {
      navigate("/catalog");
    } else {
      navigate(`/catalog/${category.slug}`);
    }
  };

  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };
  
  const resetBrands = () => {
    setSelectedBrands([]);
  };

  const handleSubcategoryClick = (subcategory) => {
    if (currentSubcategory?.id === subcategory.id) {
      navigate(`/catalog/${currentCategory.slug}`);
    } else {
      navigate(`/catalog/${currentCategory.slug}/${subcategory.slug}`);
    }
  };
  
  const resetFilters = () => {
    setSortBy("name");
    setPriceRange([0, 50000]);
    setInStockOnly(false);
    setSelectedBrands([]);
  };

  const resetAll = () => {
    navigate("/catalog");
    resetFilters();
  };

  const buildCategoryTree = (categories) => {
    const categoryMap = {};
    const rootCategories = [];

    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    categories.forEach((category) => {
      if (category.parent) {
        const parent = categoryMap[category.parent];
        if (parent) {
          parent.children.push(categoryMap[category.id]);
        }
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });
    return rootCategories;
  };
  
  const categoryTree = buildCategoryTree(categories);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="bg-dark-charcoal py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navigation />
          </div>
        </div>
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <h1 className="text-xl font-bold text-red-600 mb-4">
              Ошибка загрузки
            </h1>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={loadProducts}
              className="mt-4 px-4 py-2 bg-fashion-pink text-white rounded-lg hover:bg-fashion-pink-dark transition-colors"
            >
              Повторить попытку
            </button>
          </div>
        </main>
      </div>
    );
  }

  const title = searchQuery
    ? `Результаты поиска для: "${searchQuery}"`
    : currentSubcategory
    ? currentSubcategory.name
    : currentCategory
    ? currentCategory.name
    : "Все товары";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-dark-charcoal py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar для фильтров */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Кнопки сброса */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Фильтры</h2>
              {(categorySlug ||
                subcategorySlug ||
                searchQuery ||
                priceRange[0] > 0 ||
                priceRange[1] < 50000 ||
                inStockOnly ||
                sortBy !== "name") && (
                <button
                  onClick={resetAll}
                  className="text-sm text-fashion-pink hover:text-fashion-pink-dark font-medium focus:outline-none focus:ring-2 focus:ring-fashion-pink rounded transition-colors"
                >
                  Сбросить все
                </button>
              )}
            </div>

            {/* Секция Категорий */}
            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Категории
              </h3>
              <nav>
                <ul className="space-y-2">
                  {categoryTree.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-fashion-pink ${
                          currentCategory?.id === category.id
                            ? "bg-fashion-pink/10 text-fashion-pink font-medium border-l-4 border-fashion-pink"
                            : "text-gray-700 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300"
                        }`}
                        aria-current={
                          currentCategory?.id === category.id
                            ? "page"
                            : undefined
                        }
                      >
                        {category.name}
                      </button>

                      {/* Подкатегории */}
                      {currentCategory?.id === category.id &&
                        category.children.length > 0 && (
                          <ul className="ml-4 mt-2 space-y-1 border-l pl-4">
                            {category.children.map((subcategory) => (
                              <li key={subcategory.id}>
                                <button
                                  onClick={() =>
                                    handleSubcategoryClick(subcategory)
                                  }
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-fashion-pink ${
                                    currentSubcategory?.id === subcategory.id
                                      ? "bg-fashion-pink/20 text-fashion-pink font-medium"
                                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                  }`}
                                  aria-current={
                                    currentSubcategory?.id === subcategory.id
                                      ? "page"
                                      : undefined
                                  }
                                >
                                  {subcategory.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                  {/* Кнопка "Очистить категории" */}
                  {(currentCategory || currentSubcategory) && (
                    <li className="pt-2">
                      <button
                        onClick={() => navigate("/catalog")}
                        className="text-sm text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-colors"
                      >
                        ← Очистить категорию
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </section>

            {/* Секция Сортировки */}
            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Сортировка
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors"
              >
                <option value="name">По имени (А-Я)</option>
                <option value="price-asc">По цене (сначала дешевые)</option>
                <option value="price-desc">По цене (сначала дорогие)</option>
              </select>
            </section>

            {/* Секция Фильтра по Наличию */}
            <section>
              <label className="flex items-center space-x-3 cursor-pointer hover:text-gray-900 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-fashion-pink border-gray-300 rounded focus:ring-fashion-pink"
                />
                <span className="text-sm text-gray-700">
                  Только в наличии
                </span>
              </label>
            </section>

            {/* Секция Фильтра по Брендам */}
            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Бренды
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {brands.length === 0 && (
                  <p className="text-sm text-gray-500">Бренды не найдены</p>
                )}
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    className="flex items-center space-x-3 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                      className="w-4 h-4 text-fashion-pink border-gray-300 rounded focus:ring-fashion-pink"
                    />
                    <span className="text-sm text-gray-700">
                      {brand.name}
                    </span>
                  </label>
                ))}
              </div>
              {selectedBrands.length > 0 && (
                <button
                  onClick={resetBrands}
                  className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded transition-colors"
                >
                  Очистить бренды ({selectedBrands.length})
                </button>
              )}
            </section>
            
            {/* Секция Фильтра по Цене */}
            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                Цена (₽)
              </h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                  }
                  placeholder="От"
                  min="0"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fashion-pink"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])
                  }
                  placeholder="До"
                  min={priceRange[0]}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fashion-pink"
                />
              </div>
            </section>
          </aside>

          {/* Основной контент (Список товаров) */}
          <section className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fashion-pink mx-auto"></div>
                <p className="mt-4 text-gray-600">Загрузка товаров...</p>
              </div>
            ) : products.length > 0 ? (
              <div
                aria-label={`Список товаров: ${products.length} товаров`}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Товары не найдены
                </h3>
                <p className="text-gray-600 mb-4">
                  Попробуйте изменить параметры фильтрации или выбрать другую
                  категорию
                </p>
                {(priceRange[0] > 0 || priceRange[1] < 50000 || inStockOnly || sortBy !== "name" || selectedBrands.length > 0) && (
                    <button
                        onClick={resetFilters}
                        className="text-sm px-4 py-2 bg-fashion-pink text-white rounded-lg hover:bg-fashion-pink-dark focus:outline-none focus:ring-2 focus:ring-fashion-pink transition-colors font-medium"
                    >
                        Сбросить фильтры
                    </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
      <style jsx>{`
        .bg-dark-charcoal {
          background-color: #2C2C2C;
        }
      `}</style>
    </div>
  );
};

export default CatalogPage;