import type { Meta, StoryObj } from '@storybook/react';

import { CommonButton } from '@/components/common';
import { CommonButtonVariantEnum } from '@/components/common/CommonButton';

const meta = {
  title: 'Example/CommonButton',
  component: CommonButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof CommonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: CommonButtonVariantEnum.Primary,
    children: 'Button Label',
    disabled: false,
    className: '',
  },
};

export const Secondary: Story = {
  args: {
    variant: CommonButtonVariantEnum.Secondary,
    children: 'Button Label',
    disabled: false,
    className: '',
  },
};

export const Lend: Story = {
  args: {
    variant: CommonButtonVariantEnum.Lend,
    children: 'Button Label',
    disabled: false,
    className: '',
  },
};

export const Borrow: Story = {
  args: {
    variant: CommonButtonVariantEnum.Borrow,
    children: 'Button Label',
    disabled: false,
    className: '',
  },
};
