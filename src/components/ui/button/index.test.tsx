import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '.';

describe('Button', () => {
  it('renders a button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles onClick events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('applies size styles correctly', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('py-1 px-3 text-sm');

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('py-2 px-4');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('py-3 px-6 text-lg');
  });

  it('applies disabled styles when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('opacity-50 cursor-not-allowed');
  });
});
