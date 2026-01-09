import { NAV_LINKS, HERO_SLIDES, FEATURED_PRODUCTS, LATEST_NEWS } from './constants';

describe('Static Data Constants', () => {
  it('should have NAV_LINKS defined with correct structure', () => {
    expect(NAV_LINKS).toBeDefined();
    expect(NAV_LINKS.length).toBeGreaterThan(0);
    expect(NAV_LINKS[0]).toHaveProperty('title');
    expect(NAV_LINKS[0]).toHaveProperty('href');
  });

  it('should have HERO_SLIDES defined', () => {
    expect(HERO_SLIDES).toBeDefined();
    expect(HERO_SLIDES.length).toBeGreaterThan(0);
  });

  it('should have FEATURED_PRODUCTS defined', () => {
    expect(FEATURED_PRODUCTS).toBeDefined();
    expect(FEATURED_PRODUCTS.length).toBe(4); // Per spec: "showcasing 4 top-selling products"
  });

  it('should have LATEST_NEWS defined', () => {
    expect(LATEST_NEWS).toBeDefined();
    expect(LATEST_NEWS.length).toBeGreaterThan(0);
  });
});
