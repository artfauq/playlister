import React, { memo } from 'react';

import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
} from '@chakra-ui/react';

type Props = {
  activeStep: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
  onStepClick: (index: number) => void;
};

export const DeduplicateStepper = memo<Props>(({ activeStep, steps, onStepClick }) => {
  return (
    <Stepper index={activeStep}>
      {steps.map((step, index) => (
        <Step
          key={step.title}
          onClick={index + 1 < activeStep ? () => onStepClick(index + 1) : undefined}
        >
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
});
DeduplicateStepper.displayName = 'DeduplicateStepper';
