export interface CompareProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brandName?: string;
  specs?: Record<string, any>;
}

const COMPARE_KEY = 'techstore_compare_products';

export const getCompareList = (): CompareProduct[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCompareList = (items: CompareProduct[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('compare_updated'));
};

export const addToCompare = (product: CompareProduct): { success: boolean; message?: string } => {
  const current = getCompareList();
  if (current.find((p) => p.id === product.id)) {
    return { success: false, message: 'Sản phẩm đã có trong danh sách so sánh' };
  }
  if (current.length >= 4) {
    return { success: false, message: 'Chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc' };
  }
  current.push(product);
  saveCompareList(current);
  return { success: true };
};

export const removeFromCompare = (id: string): void => {
  const current = getCompareList().filter((p) => p.id !== id);
  saveCompareList(current);
};

export const clearCompare = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COMPARE_KEY);
  window.dispatchEvent(new Event('compare_updated'));
};
