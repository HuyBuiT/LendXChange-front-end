import type { Meta, StoryObj } from '@storybook/react';
import DropdownDemo from './DropdownDemo';

const meta = {
  title: 'Example/CommonDropdown',
  component: DropdownDemo,
  decorators: [(Story) => <Story />],
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DropdownDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
