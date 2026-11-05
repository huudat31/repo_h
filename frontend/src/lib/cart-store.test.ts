import { describe, it, expect, beforeEach } from 'vitest';
import { getCart, addToCart, removeFromCart, updateQuantity, clearCart } from './cart-store';

describe('cart-store', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    // Polyfill localStorage in test
    global.window = {
      dispatchEvent: () => true,
    } as any;
    global.localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        mockStorage = {};
      },
    } as any;
  });

  it('starts with an empty cart', () => {
    expect(getCart()).toEqual([]);
  });

  it('adds an item to cart with quantity 1 by default', () => {
    const product = {
      id: 'p-1',
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      price: 34490000,
      image: '/iphone.jpg',
    };

    addToCart(product);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe('p-1');
    expect(cart[0].quantity).toBe(1);
  });

  it('increments quantity when adding the same item again', () => {
    const product = {
      id: 'p-1',
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      price: 34490000,
      image: '/iphone.jpg',
    };

    addToCart(product, 1);
    addToCart(product, 2);

    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(3);
  });

  it('updates quantity to specified amount, clamped at minimum 1', () => {
    const product = {
      id: 'p-1',
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      price: 34490000,
      image: '/iphone.jpg',
    };

    addToCart(product, 2);
    updateQuantity('p-1', 5);
    expect(getCart()[0].quantity).toBe(5);

    updateQuantity('p-1', -10); // should clamp to 1
    expect(getCart()[0].quantity).toBe(1);
  });

  it('removes item from cart by id', () => {
    addToCart({ id: 'p-1', name: 'Item 1', slug: 'item-1', price: 100, image: '' });
    addToCart({ id: 'p-2', name: 'Item 2', slug: 'item-2', price: 200, image: '' });

    expect(getCart()).toHaveLength(2);
    removeFromCart('p-1');

    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe('p-2');
  });

  it('clears all items in cart', () => {
    addToCart({ id: 'p-1', name: 'Item 1', slug: 'item-1', price: 100, image: '' });
    clearCart();
    expect(getCart()).toEqual([]);
  });
});
