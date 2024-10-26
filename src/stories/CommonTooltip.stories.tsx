import type { Meta, StoryObj } from '@storybook/react';

import { CommonTooltip } from '@/components/common';
import { CommonTooltipVariantEnum } from '@/components/common/common-tooltip';

const meta = {
  title: 'Example/CommonTooltip',
  component: CommonTooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof CommonTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: CommonTooltipVariantEnum.Info,
    trigger: <p>Common Tooltip</p>,
    children: <p>Content Common Tooltip</p>,
  },
};
