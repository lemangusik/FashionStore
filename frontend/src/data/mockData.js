export const categories = [
  {
    id: 1,
    name: "Электроника",
    icon: "📱",
    slug: "electronics",
    subcategories: [
      { id: 11, name: "Смартфоны", slug: "smartphones", productCount: 156 },
      { id: 12, name: "Ноутбуки", slug: "laptops", productCount: 89 },
      { id: 13, name: "Телевизоры", slug: "tvs", productCount: 67 },
      { id: 14, name: "Наушники", slug: "headphones", productCount: 234 },
      { id: 15, name: "Планшеты", slug: "tablets", productCount: 45 },
      { id: 16, name: "Фототехника", slug: "photo", productCount: 78 },
      { id: 17, name: "Игровые консоли", slug: "gaming", productCount: 34 },
    ],
  },
  {
    id: 2,
    name: "Одежда",
    icon: "👕",
    slug: "clothing",
    subcategories: [
      { id: 21, name: "Мужская одежда", slug: "mens", productCount: 345 },
      { id: 22, name: "Женская одежда", slug: "womens", productCount: 567 },
      { id: 23, name: "Детская одежда", slug: "kids", productCount: 234 },
      { id: 24, name: "Обувь", slug: "shoes", productCount: 189 },
      { id: 25, name: "Аксессуары", slug: "accessories", productCount: 156 },
    ],
  },
  {
    id: 3,
    name: "Дом и сад",
    icon: "🏠",
    slug: "home-garden",
    subcategories: [
      { id: 31, name: "Мебель", slug: "furniture", productCount: 278 },
      { id: 32, name: "Текстиль", slug: "textiles", productCount: 145 },
      { id: 33, name: "Кухня", slug: "kitchen", productCount: 367 },
      { id: 34, name: "Освещение", slug: "lighting", productCount: 89 },
      {
        id: 35,
        name: "Садовая техника",
        slug: "garden-tools",
        productCount: 67,
      },
      { id: 36, name: "Интерьер", slug: "interior", productCount: 234 },
    ],
  },
  {
    id: 4,
    name: "Красота",
    icon: "💄",
    slug: "beauty",
    subcategories: [
      { id: 41, name: "Косметика", slug: "cosmetics", productCount: 456 },
      { id: 42, name: "Парфюмерия", slug: "perfume", productCount: 178 },
      { id: 43, name: "Уход за кожей", slug: "skincare", productCount: 289 },
      { id: 44, name: "Волосы", slug: "hair", productCount: 167 },
      { id: 45, name: "Маникюр", slug: "manicure", productCount: 134 },
    ],
  },
  {
    id: 5,
    name: "Спорт",
    icon: "⚽",
    slug: "sports",
    subcategories: [
      { id: 51, name: "Фитнес", slug: "fitness", productCount: 189 },
      { id: 52, name: "Велоспорт", slug: "cycling", productCount: 78 },
      { id: 53, name: "Туризм", slug: "tourism", productCount: 145 },
      { id: 54, name: "Зимние виды", slug: "winter-sports", productCount: 67 },
      { id: 55, name: "Командные виды", slug: "team-sports", productCount: 89 },
    ],
  },
  {
    id: 6,
    name: "Книги",
    icon: "📚",
    slug: "books",
    subcategories: [
      { id: 61, name: "Художественная", slug: "fiction", productCount: 1234 },
      { id: 62, name: "Научная", slug: "science", productCount: 567 },
      { id: 63, name: "Детские книги", slug: "children", productCount: 345 },
      {
        id: 64,
        name: "Учебная литература",
        slug: "educational",
        productCount: 678,
      },
      {
        id: 65,
        name: "Бизнес-литература",
        slug: "business",
        productCount: 234,
      },
    ],
  },
];

export const products = [
  {
    id: 1,
    name: "Смартфон Premium",
    price: 29999,
    category: "Электроника",
    image: "https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Phone",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Футболка классическая",
    price: 1999,
    category: "Одежда",
    image: "https://via.placeholder.com/300x300/EF4444/FFFFFF?text=T-Shirt",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 3,
    name: "Наушники беспроводные",
    price: 5999,
    category: "Электроника",
    image: "https://via.placeholder.com/300x300/10B981/FFFFFF?text=Headphones",
    rating: 4.7,
    inStock: false,
  },
  {
    id: 4,
    name: 'Книга "React для начинающих"',
    price: 1499,
    category: "Книги",
    image: "https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Book",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 5,
    name: "Беговая дорожка",
    price: 45999,
    category: "Спорт",
    image: "https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Treadmill",
    rating: 4.3,
    inStock: true,
  },
  {
    id: 6,
    name: "Набор косметики",
    price: 3499,
    category: "Красота",
    image: "https://via.placeholder.com/300x300/EC4899/FFFFFF?text=Beauty",
    rating: 4.6,
    inStock: true,
  },
];

export const userProfile = {
  name: "Иван Иванов",
  avatar: "https://via.placeholder.com/40x40/6B7280/FFFFFF?text=UI",
  cartItems: 3,
  isLoggedIn: false, // Добавлено поле для отслеживания статуса входа
};

// Функции для работы с пользователем
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({
          success: true,
          user: {
            id: 1,
            email: email,
            name: "Иван Иванов",
            avatar: "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=UI",
          },
        });
      } else {
        reject({
          success: false,
          message: "Неверный email или пароль",
        });
      }
    }, 1000);
  });
};

export const mockRegister = (userData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userData.email && userData.password) {
        resolve({
          success: true,
          user: {
            id: Date.now(),
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`,
            avatar: "https://via.placeholder.com/40x40/10B981/FFFFFF?text=NU",
          },
        });
      } else {
        reject({
          success: false,
          message: "Ошибка регистрации",
        });
      }
    }, 1500);
  });
};
