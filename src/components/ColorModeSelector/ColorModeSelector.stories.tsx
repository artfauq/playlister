import React, { ComponentProps } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ColorModeSelector as ColorModeSelectorComponent } from './ColorModeSelector';

export default {
  title: 'ColorModeSelector',
  component: ColorModeSelectorComponent,
  parameters: {
    controls: {
      include: [],
    },
    layout: 'centered',
  },
  argTypes: {},
  args: {},
} as ComponentMeta<typeof ColorModeSelectorComponent>;

const Template: ComponentStory<typeof ColorModeSelectorComponent> = ({
  ...props
}: ComponentProps<typeof ColorModeSelectorComponent>) => <ColorModeSelectorComponent {...props} />;

export const ColorModeSelector = Template.bind({});
