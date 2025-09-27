import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Foundations/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  args: {
    children: 'Give Today'
  }
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  }
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost'
  }
};

export const WithIcon: Story = {
  args: {
    icon: '→'
  }
};
