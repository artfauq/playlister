import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  component: Logo,
  title: 'Components/Logo',
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Basic: Story = {
  render: () => <Logo />,
};
