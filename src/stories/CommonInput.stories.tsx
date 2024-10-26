import type { Meta, StoryObj } from '@storybook/react';

import { CommonInput } from '@/components/common';
import { CaretIcon } from '@/components/icons';

const meta = {
  title: 'Example/CommonInput',
  component: CommonInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof CommonInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Error: Story = {
  args: { isError: true },
};

export const HaveStartEnvironment = {
  args: { startAdornment: <CaretIcon /> },
};

export const HaveTitleAndMessage = {
  args: {
    isError: true,
    startAdornment: <CaretIcon />,
    inputTitle: 'Common Input',
    inputMessage: 'Message Common Input',
  },
};
