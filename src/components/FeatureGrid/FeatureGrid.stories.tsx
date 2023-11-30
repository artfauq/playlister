import React, { ComponentProps } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FeatureGrid as FeatureGridComponent } from './FeatureGrid';

export default {
  title: 'FeatureGrid',
  component: FeatureGridComponent,
  parameters: {
    controls: {
      include: [],
    },
    layout: 'centered',
  },
  argTypes: {},
  args: {},
} as ComponentMeta<typeof FeatureGridComponent>;

const Template: ComponentStory<typeof FeatureGridComponent> = ({
  ...props
}: ComponentProps<typeof FeatureGridComponent>) => <FeatureGridComponent {...props} />;

export const FeatureGrid = Template.bind({});
