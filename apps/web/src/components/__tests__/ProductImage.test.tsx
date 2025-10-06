import { render, screen, waitFor } from '@testing-library/react';
import { ProductImage } from '../ProductImage';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

global.IntersectionObserver = MockIntersectionObserver as any;

describe('ProductImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with lazy loading attributes', () => {
    render(
      <ProductImage 
        src="/test-image.jpg" 
        alt="Test product" 
        className="custom-class"
      />
    );

    const img = screen.getByAlt('Test product');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('custom-class');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should set up intersection observer on mount', () => {
    render(<ProductImage src="/test-image.jpg" alt="Test product" />);
    
    expect(MockIntersectionObserver.prototype.observe).toHaveBeenCalled();
  });

  it('should apply fade-in transition classes', () => {
    render(<ProductImage src="/test-image.jpg" alt="Test product" />);
    
    const img = screen.getByAlt('Test product');
    expect(img).toHaveClass('transition-opacity');
    expect(img).toHaveClass('duration-300');
  });

  it('should call onLoad callback when image loads', async () => {
    const onLoad = jest.fn();
    render(
      <ProductImage 
        src="/test-image.jpg" 
        alt="Test product" 
        onLoad={onLoad}
      />
    );

    const img = screen.getByAlt('Test product');
    
    // Simulate image load
    img.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it('should disconnect observer on unmount', () => {
    const { unmount } = render(
      <ProductImage src="/test-image.jpg" alt="Test product" />
    );

    unmount();

    expect(MockIntersectionObserver.prototype.disconnect).toHaveBeenCalled();
  });
});
