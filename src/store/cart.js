import { create } from 'zustand';

const API_BASE_URL = 'https://backend.pinkstories.ae/api';

export const useCartStore = create((set, get) => ({
  cart: { items: [] },
  itemCount: 0,
  totalAmount: 0,
  loading: false,
  error: null,

  // Add item to cart
  addToCart: async (userId, productData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId: productData._id,
          quantity: productData.quantity || 1,
          selectedSize: productData.selectedSize,
          selectedColor: productData.selectedColor,
          selectedSizeType: productData.selectedSizeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }

      set({
        cart: data.cart,
        itemCount: data.itemCount,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Get cart
  fetchCart: async (userId) => {
    if (!userId) return;
    
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cart');
      }

      set({
        cart: data.cart,
        itemCount: data.itemCount,
        totalAmount: data.totalAmount,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (userId, itemId, quantity) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}/item/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart item');
      }

      set({
        cart: data.cart,
        itemCount: data.itemCount,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (userId, itemId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}/item/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item from cart');
      }

      set({
        cart: data.cart,
        itemCount: data.itemCount,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Clear cart
  clearCart: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}/clear`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear cart');
      }

      set({
        cart: data.cart,
        itemCount: data.itemCount,
        totalAmount: 0,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  // Get cart item count (for header/navbar)
  getCartItemCount: () => {
    const { itemCount } = get();
    return itemCount;
  },

  // Get total amount
  getTotalAmount: () => {
    const { totalAmount } = get();
    return totalAmount;
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset cart state
  resetCart: () => set({
    cart: { items: [] },
    itemCount: 0,
    totalAmount: 0,
    loading: false,
    error: null,
  }),
}));