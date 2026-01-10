import React from 'react';
import { render, screen } from '@testing-library/react';
import { LatestNews } from './latest-news';
import { LATEST_NEWS } from '@/lib/constants';

describe('LatestNews', () => {
  it('renders correctly with heading', () => {
    render(<LatestNews />);
    expect(screen.getByText(/Latest News/i)).toBeInTheDocument();
  });

  it('renders all news items', () => {
    render(<LatestNews />);
    LATEST_NEWS.forEach(news => {
      expect(screen.getByText(news.title)).toBeInTheDocument();
      expect(screen.getByText(news.excerpt)).toBeInTheDocument();
    });
  });

  it('has links to news articles', () => {
    render(<LatestNews />);
    LATEST_NEWS.forEach(news => {
        const links = screen.getAllByRole('link', { name: new RegExp(news.title, 'i') });
        expect(links.some(link => link.getAttribute('href') === news.href)).toBe(true);
    });
  });
});
