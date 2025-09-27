import type { Meta, StoryObj } from '@storybook/react';
import { Body, Button, Card, CardContent, CardFooter, CardHeader, Heading } from '.';

const meta: Meta<typeof Card> = {
  title: 'Foundations/Card',
  component: Card,
  args: {
    children: 'Card content'
  }
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <Heading level={3}>Pan-African Impact Framework</Heading>
          <Body variant="muted">
            Our integrated approach spans education, health, water, livelihoods, and climate resilience—sequenced with communities
            to deliver lasting change.
          </Body>
        </CardHeader>
        <CardContent>
          <Body variant="muted">Education studios igniting digital literacy and future-ready skills.</Body>
          <Body variant="muted">Water security corridors with regenerative infrastructure and training.</Body>
          <Body variant="muted">Economic empowerment through microfinance, cooperatives, and creative hubs.</Body>
        </CardContent>
        <CardFooter>
          <Button size="sm">Back the framework</Button>
          <Button size="sm" variant="ghost">
            Partner with us
          </Button>
        </CardFooter>
      </>
    )
  }
};

export const Bleed: Story = {
  args: {
    bleed: true,
    className: 'p-0 overflow-hidden',
    children: (
      <>
        <img
          alt="Solar Learning Lab"
          className="h-40 w-full object-cover"
          src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
        />
        <div className="space-y-4 p-6">
          <Heading level={3}>Solar Learning Labs</Heading>
          <Body variant="muted">
            Off-grid classrooms in Keta and Hohoe blending digital curricula with local mentorship to accelerate STEM pathways.
          </Body>
        </div>
      </>
    )
  }
};
