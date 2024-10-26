import type { Meta, StoryObj } from '@storybook/react';

import { CommonToggleButton } from '@/components/common';

const meta = {
  title: 'Example/CommonToggleButton',
  component: CommonToggleButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof CommonToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCheckedChange: (checked) => {
      alert(checked);
    },
  },
};
