import type { Meta, StoryObj } from '@storybook/react';

import { CommonDialog } from '@/components/common';

const meta = {
  title: 'Example/CommonDialog',
  component: CommonDialog,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Story
        isOpen={true}
        onClose={() => {
          return;
        }}
        dialogTitle="Common Dialog"
        isShowIconClose={true}
      >
        <p>Common Dialog</p>
      </Story>
    ),
  ],
  argTypes: {},
} satisfies Meta<typeof CommonDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {
      return;
    },
    dialogTitle: 'Common Dialog',
    children: (
      <div>
        <p>Common Dialog</p>
      </div>
    ),
  },
};
