import NextLink from 'next/link';
import React from 'react';

import { HStack, Icon, Link, StackProps, Text, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export type LinkItemProps = {
  text: string;
  icon: IconType;
  href?: string;
};

type NavItemProps = StackProps &
  LinkItemProps & {
    isActive: boolean;
  };

export const NavItem: React.FC<NavItemProps> = ({ icon, href, isActive, text, ...rest }) => {
  const activeBackgroundColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Link
      as={NextLink}
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <HStack
        align="center"
        bg={isActive ? activeBackgroundColor : undefined}
        color={useColorModeValue('gray.800', 'gray.50')}
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        spacing="4"
        _hover={{
          bg: useColorModeValue('gray.200', 'gray.600'),
        }}
        {...rest}
      >
        <Icon as={icon} />
        <Text>{text}</Text>
      </HStack>
    </Link>
  );
};
