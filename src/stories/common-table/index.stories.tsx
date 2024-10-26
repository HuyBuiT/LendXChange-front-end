import type { Meta, StoryObj } from '@storybook/react';
import CommonTableDemo from './CommonTableDemo';

const meta = {
  title: 'Example/CommonTableDemo',
  component: CommonTableDemo,
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof CommonTableDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
