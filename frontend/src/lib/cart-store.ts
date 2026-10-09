export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  specs?: Record<string, any>;
}

const CART_KEY = 'techstore_cart';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart_updated'));
};

export const addToCart = (product: {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  specs?: Record<string, any>;
}, quantity = 1): void => {
  const current = getCart();
  const existingIndex = current.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    current[existingIndex].quantity += quantity;
  } else {
    current.push({ ...product, quantity });
  }

  saveCart(current);
};

export const removeFromCart = (id: string): void => {
  const current = getCart().filter((item) => item.id !== id);
  saveCart(current);
};

export const updateQuantity = (id: string, quantity: number): void => {
  const current = getCart();
  const item = current.find((i) => i.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(current);
  }
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cart_updated'));
};
