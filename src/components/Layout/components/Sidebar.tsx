import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { Box, BoxProps, CloseButton, Flex, useColorModeValue } from '@chakra-ui/react';
import { GoFlame, GoHeart } from 'react-icons/go';
import { PiPlaylist } from 'react-icons/pi';
import { SlMagicWand } from 'react-icons/sl';

import { Logo } from '@src/components/Logo';
import { useAppTranslation } from '@src/hooks';
import { getRoute } from '@src/routes';

import { LinkItemProps, NavItem } from './NavItem';

type SidebarProps = BoxProps & {
  onClose: () => void;
};

export const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  const { t } = useAppTranslation();

  const linkItems: LinkItemProps[] = useMemo(
    () => [
      {
        text: t('navigation:playlists'),
        icon: PiPlaylist,
        href: getRoute('PlaylistsIndex'),
      },
      {
        text: t('navigation:deduplicate'),
        icon: SlMagicWand,
        href: getRoute('Deduplicate'),
      },
      {
        text: t('navigation:topTracks'),
        icon: GoFlame,
        href: getRoute('TopTracks'),
      },
      {
        text: t('navigation:unclassifiedTracks'),
        icon: GoHeart,
        href: getRoute('UnclassifiedTracks'),
      },
    ],
    [t],
  );

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" ml="6" mr="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {linkItems.map(link => (
        <NavItem key={link.text} {...link} isActive={router.pathname === link.href} />
      ))}
    </Box>
  );
};
