import type { Meta, StoryObj } from '@storybook/react';

import { CommonToast } from '@/components/common';

const meta = {
  title: 'Example/CommonToast',
  component: CommonToast,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof CommonToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    toastTitle: 'Common Toast',
    children: 'Content Common Toast',
  },
};
