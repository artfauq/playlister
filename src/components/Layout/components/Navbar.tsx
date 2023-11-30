import React from 'react';

import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { CiLogout } from 'react-icons/ci';
import { FiChevronDown, FiMenu } from 'react-icons/fi';

import { ColorModeSelector } from '@src/components/ColorModeSelector';
import { Logo } from '@src/components/Logo';
import { useAppTranslation, useCurrentUser } from '@src/hooks';

type NavbarProps = FlexProps & {
  onOpen: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ onOpen, ...rest }) => {
  const { t } = useAppTranslation();
  const currentUser = useCurrentUser();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Logo display={{ base: 'flex', md: 'none' }} />

      <HStack spacing={{ base: '2', md: '4' }}>
        <ColorModeSelector />
        <Menu>
          <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
            <HStack>
              {currentUser && (
                <>
                  <Avatar bg="grey.900" name={currentUser.name} size="sm" src={currentUser.image} />
                  <Text display={{ base: 'none', md: 'flex' }} fontSize="sm">
                    {currentUser.name}
                  </Text>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </>
              )}
            </HStack>
          </MenuButton>

          <MenuList
            bg={useColorModeValue('white', 'gray.900')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <MenuItem icon={<Icon as={CiLogout} />} onClick={handleSignOut}>
              {t('common:signOut')}
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};
