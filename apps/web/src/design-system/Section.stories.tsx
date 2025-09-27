import type { Meta, StoryObj } from '@storybook/react';
import { Body, Button, Heading, Section } from '.';

const meta: Meta<typeof Section> = {
  title: 'Foundations/Section',
  component: Section,
  args: {
    children: (
      <div className="space-y-6">
        <Heading level={2}>Demo Section Layout</Heading>
        <Body>
          Sections manage vertical rhythm, optional backgrounds, and container padding so content remains consistent from hero to
          footer.
        </Body>
        <Button>Primary CTA</Button>
      </div>
    )
  }
};

export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {};

export const Tinted: Story = {
  args: {
    background: 'tinted'
  }
};

export const Muted: Story = {
  args: {
    background: 'muted'
  }
};

export const Inverted: Story = {
  args: {
    background: 'inverted',
    paddedContainer: true
  }
};
