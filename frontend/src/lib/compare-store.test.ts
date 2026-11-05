import { describe, it, expect, beforeEach } from 'vitest';
import { getCompareList, addToCompare, removeFromCompare, clearCompare } from './compare-store';

describe('compare-store', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
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

  it('starts with an empty compare list', () => {
    expect(getCompareList()).toEqual([]);
  });

  it('adds item to compare list successfully', () => {
    const res = addToCompare({
      id: 'p-1',
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16',
      price: 34000000,
      image: '/iphone.jpg',
    });
    expect(res.success).toBe(true);
    expect(getCompareList()).toHaveLength(1);
  });

  it('rejects adding duplicate items', () => {
    const product = {
      id: 'p-1',
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16',
      price: 34000000,
      image: '/iphone.jpg',
    };
    addToCompare(product);
    const res = addToCompare(product);

    expect(res.success).toBe(false);
    expect(res.message).toContain('đã có');
    expect(getCompareList()).toHaveLength(1);
  });

  it('limits compare list to maximum 4 items', () => {
    for (let i = 1; i <= 4; i++) {
      const res = addToCompare({
        id: `p-${i}`,
        name: `Product ${i}`,
        slug: `product-${i}`,
        price: 1000000 * i,
        image: '',
      });
      expect(res.success).toBe(true);
    }

    // Try adding 5th item
    const res5 = addToCompare({
      id: 'p-5',
      name: 'Product 5',
      slug: 'product-5',
      price: 5000000,
      image: '',
    });

    expect(res5.success).toBe(false);
    expect(res5.message).toContain('tối đa 4 sản phẩm');
    expect(getCompareList()).toHaveLength(4);
  });

  it('removes item from compare list', () => {
    addToCompare({ id: 'p-1', name: 'P1', slug: 'p1', price: 10, image: '' });
    addToCompare({ id: 'p-2', name: 'P2', slug: 'p2', price: 20, image: '' });

    removeFromCompare('p-1');
    const list = getCompareList();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('p-2');
  });

  it('clears all items in compare list', () => {
    addToCompare({ id: 'p-1', name: 'P1', slug: 'p1', price: 10, image: '' });
    clearCompare();
    expect(getCompareList()).toEqual([]);
  });
});
