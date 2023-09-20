import React, { ComponentProps } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { TemplateName as TemplateNameComponent } from './TemplateName';

export default {
  title: 'TemplateName',
  component: TemplateNameComponent,
  parameters: {
    controls: {
      include: [],
    },
    layout: 'centered',
  },
  argTypes: {},
  args: {},
} as ComponentMeta<typeof TemplateNameComponent>;

const Template: ComponentStory<typeof TemplateNameComponent> = ({
  ...props
}: ComponentProps<typeof TemplateNameComponent>) => <TemplateNameComponent {...props} />;

export const TemplateName = Template.bind({});
