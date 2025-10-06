import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './ErrorState';
import { ApiError } from '../lib/api';

const meta = {
  title: 'Components/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: new Error('Something went wrong. Please try again.'),
    onRetry: () => console.log('Retry clicked'),
  },
};

export const NetworkError: Story = {
  args: {
    error: new ApiError(
      'Network failed',
      0,
      'NETWORK_ERROR'
    ),
    onRetry: () => console.log('Retry clicked'),
  },
};

export const ValidationError: Story = {
  args: {
    error: new ApiError(
      'Validation failed',
      400,
      'VALIDATION_ERROR'
    ),
    onRetry: () => console.log('Retry clicked'),
  },
};

export const CustomTitle: Story = {
  args: {
    error: new Error('Failed to load products'),
    title: 'Products Unavailable',
    onRetry: () => console.log('Retry clicked'),
  },
};

export const WithoutRetry: Story = {
  args: {
    error: new Error('This error cannot be retried'),
    showRetry: false,
  },
};

export const PaymentError: Story = {
  args: {
    error: new ApiError(
      'Payment processing failed',
      402,
      'PAYMENT_FAILED'
    ),
    title: 'Payment Failed',
    onRetry: () => console.log('Retry clicked'),
  },
};
