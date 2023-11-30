import React from 'react';

import { Box, BoxProps, Card, Flex, Icon, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export type FeatureType = {
  title: string;
  text: string;
  icon: IconType;
  action?: React.ReactElement;
};

type FeatureProps = FeatureType;

const Feature: React.FC<FeatureProps> = ({ action, icon, title, text }) => {
  return (
    <Card as={Stack} px="6" pb="8" pt="4">
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="gray.100"
        mb={1}
      >
        <Icon as={icon} boxSize="8" />
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text align="justify" color="gray.600">
        {text}
      </Text>
      {action}
    </Card>
  );
};

type FeatureGridProps = {
  features: FeatureType[];
} & BoxProps;

export const FeatureGrid: React.FC<FeatureGridProps> = ({ features, ...rest }) => {
  return (
    <Box p={4} {...rest}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        {features.map(feature => (
          <Feature key={feature.title} {...feature} />
        ))}
      </SimpleGrid>
    </Box>
  );
};
