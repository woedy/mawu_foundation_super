import type { Meta, StoryObj } from '@storybook/react';
import { Body, Caption, Eyebrow, Heading } from '.';

const meta: Meta<typeof Heading> = {
  title: 'Foundations/Typography',
  component: Heading,
  parameters: {
    layout: 'padded'
  }
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Headings: Story = {
  render: () => (
    <div className="space-y-6">
      <Heading level={1}>Heading 1 – Hero Statement</Heading>
      <Heading level={2}>Heading 2 – Section Title</Heading>
      <Heading level={3}>Heading 3 – Card Title</Heading>
      <Heading level={4}>Heading 4 – Highlight Title</Heading>
      <Heading level={5}>Heading 5 – Eyebrow Support</Heading>
      <Heading level={6}>Heading 6 – Compact Label</Heading>
    </div>
  )
};

export const CopyVariants: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Eyebrow>Eyebrow label</Eyebrow>
      <Body>
        We co-create resilient futures with communities across Africa. From schools and clinics to regenerative water systems,
        our initiatives are co-designed with residents.
      </Body>
      <Body variant="muted">
        Muted copy is perfect for supporting paragraphs, legal notes, or nested card details. It maintains readability while
        reducing visual hierarchy.
      </Body>
      <Body variant="light" className="bg-ink-900 p-6 text-white">
        Light copy demonstrates usage on dark surfaces such as hero overlays and footers.
      </Body>
      <Caption>Caption text for data sources and metrics.</Caption>
    </div>
  )
};
