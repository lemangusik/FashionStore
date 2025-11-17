/* eslint-disable no-unused-vars */
// const API_BASE_URL = "http://95.31.6.150:8000/api";
const API_BASE_URL = "http://localhost:8000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    const config = {
      headers,
      ...options,
    };

    console.log(`Making request to: ${url}`, {
      headers,
      method: options.method,
    }); // Добавим лог

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error ${response.status}:`, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  // Аутентификация
  async login(username, password) {
    return this.request("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async register(userData) {
    return this.request("/auth/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Корзина
  async getCart() {
    return this.request("/carts/my_cart/");
  }

  async addToCart(productId, quantity = 1) {
    return this.request("/cart-items/", {
      method: "POST",
      body: JSON.stringify({
        product: productId,
        quantity: quantity,
      }),
    });
  }

  async updateCartItem(cartItemId, quantity) {
    return this.request(`/cart-items/${cartItemId}/`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartItemId) {
    return this.request(`/cart-items/${cartItemId}/`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    const cart = await this.getCart();
    if (cart.items && cart.items.length > 0) {
      const deletePromises = cart.items.map((item) =>
        this.removeFromCart(item.id)
      );
      await Promise.all(deletePromises);
    }
  }

  // Заказы
  async createOrder(orderData) {
    return this.request("/orders/", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request("/orders/");
  }

  async getMainCategories() {
    return this.request("/categories/main/");
  }

  async getAllCategories() {
    return this.request("/categories/");
  }

  async getProducts(params = {}) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    if (cleanParams.search) {
      const query = cleanParams.search;
      delete cleanParams.search;
      const queryString = new URLSearchParams(cleanParams).toString();
      return this.request(
        `/products/search/?q=${encodeURIComponent(query)}&${queryString}`
      );
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    return this.request(`/products/?${queryString}`);
  }

  async getProduct(slug) {
    return this.request(`/products/${slug}/`);
  }

  async createProduct(productData) {
    return this.request("/products/", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(slug, productData) {
    return this.request(`/products/${slug}/`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(slug) {
    return this.request(`/products/${slug}/`, {
      method: "DELETE",
    });
  }
  
  async getBrands() {
    return this.request("/brands/");
  }

  async searchProducts(query, params = {}) {
    const searchParams = new URLSearchParams({
      q: query,
      ...params,
    });
    return this.request(`/products/search/?${searchParams}`);
  }

  async getFeaturedProducts() {
    return this.request("/products/featured/");
  }
}

export const apiService = new ApiService();
