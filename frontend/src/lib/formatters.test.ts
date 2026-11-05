import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate } from './formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('formats price in Vietnamese Dong currency style', () => {
      const formatted = formatPrice(34490000);
      // Replace non-breaking spaces if any
      const normalized = formatted.replace(/\s/g, ' ');
      expect(normalized).toMatch(/34\.490\.000/);
      expect(normalized).toMatch(/₫/);
    });

    it('formats 0 correctly', () => {
      const formatted = formatPrice(0).replace(/\s/g, ' ');
      expect(formatted).toMatch(/0/);
      expect(formatted).toMatch(/₫/);
    });
  });

  describe('formatDate', () => {
    it('formats date string into readable Vietnamese format', () => {
      const dateStr = '2026-03-10T10:00:00Z';
      const formatted = formatDate(dateStr);
      expect(formatted).toContain('2026');
      expect(formatted).toBeTruthy();
    });
  });
});
