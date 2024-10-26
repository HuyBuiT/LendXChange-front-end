import type { Meta, StoryObj } from '@storybook/react';

import { CommonAmountInput } from '@/components/common';

const meta = {
  title: 'Example/CommonAmountInput',
  component: CommonAmountInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof CommonAmountInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
