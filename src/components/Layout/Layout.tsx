import React from 'react';

import {
  Box,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { Footer } from '@src/components/Footer';

import { Navbar, Sidebar } from './components';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')}>
      <Sidebar onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Navbar onOpen={onOpen} />
      <VStack
        align="stretch"
        minH="calc(100vh - var(--chakra-sizes-20))"
        ml={{ base: 0, md: 60 }}
        p="8"
        spacing="8"
      >
        {children}
      </VStack>
      <Footer ml={{ base: 0, md: 60 }} />
    </Box>
  );
};
