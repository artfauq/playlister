import { useRouter } from 'next/router';
import React from 'react';

import {
  Avatar,
  Center,
  Container,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import setLanguage from 'next-translate/setLanguage';
import { CiLogout } from 'react-icons/ci';

import { Logo } from '@src/components/Logo';
import { useAppTranslation, useCurrentUser } from '@src/hooks';

import i18nConfig from '../../../i18n';

import { BackButton } from './BackButton';

const { locales } = i18nConfig;

export const Header: React.FC = () => {
  const router = useRouter();
  const { t, lang } = useAppTranslation();
  const currentUser = useCurrentUser();

  const handleSignOut = async () => {
    const { url } = await signOut({ callbackUrl: '/', redirect: false });

    router.push(url);
  };

  const handleLanguageChange = async (locale: string) => {
    await setLanguage(locale);
  };

  return (
    <Container as="header" maxW={['none', '8xl']} py="4">
      {/* <ColorModeSelector /> */}
      {currentUser ? (
        <HStack align="flex-start" justify="space-between">
          <BackButton />
          {currentUser && (
            <Menu>
              <MenuButton>
                <Avatar
                  bg="spotify.black"
                  name={currentUser.name}
                  size="sm"
                  src={currentUser.image}
                />
              </MenuButton>
              <MenuList>
                {locales.map(lng => {
                  if (lng === lang) return null;

                  return (
                    <MenuItem key={lng} onClick={() => handleLanguageChange(lng)}>
                      {t(`common:languages.${lng}`)}
                    </MenuItem>
                  );
                })}
                <MenuItem icon={<Icon as={CiLogout} />} onClick={handleSignOut}>
                  {t('common:signOut')}
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      ) : (
        <Center>
          <Logo size="lg" />
        </Center>
      )}
    </Container>
  );
};
