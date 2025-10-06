import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBanner } from './ErrorBanner';
import { ApiError } from '../lib/api';

const meta = {
  title: 'Components/ErrorBanner',
  component: ErrorBanner,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: new Error('Something went wrong. Please try again.'),
  },
};

export const NetworkError: Story = {
  args: {
    error: new ApiError(
      'Network failed',
      0,
      'NETWORK_ERROR'
    ),
  },
};

export const CustomMessage: Story = {
  args: {
    error: new Error('Original error'),
    message: 'Using cached data. Some information may be outdated.',
  },
};

export const WithDismiss: Story = {
  args: {
    error: new Error('This is a dismissible error'),
    showDismiss: true,
    onDismiss: () => console.log('Dismissed'),
  },
};

export const FallbackDataScenario: Story = {
  args: {
    error: new ApiError(
      'API unavailable',
      503,
      'SERVICE_UNAVAILABLE'
    ),
    message: 'Unable to load latest products. Showing cached data.',
    showDismiss: true,
    onDismiss: () => console.log('Dismissed'),
  },
};

export const InsufficientInventory: Story = {
  args: {
    error: new ApiError(
      'Insufficient inventory',
      400,
      'INSUFFICIENT_INVENTORY'
    ),
  },
};
