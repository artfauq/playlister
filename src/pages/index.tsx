import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import Trans from 'next-translate/Trans';
import { FaSpotify } from 'react-icons/fa';
import { FcDeleteDatabase, FcMultipleInputs, FcPositiveDynamic } from 'react-icons/fc';

import { FeatureGrid, FeatureType, Logo } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { useCurrentUser } from '@src/modules/user';
import { getRoute } from '@src/routes';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(async ({ session }) => {
  if (session) {
    return {
      redirect: {
        destination: getRoute('PlaylistsIndex'),
        permanent: false,
      },
    };
  }

  return { props: {} };
}, false);

const onSignIn = () => {
  signIn('spotify');
};

const Home: NextPage = () => {
  const { t } = useAppTranslation();
  const router = useRouter();
  const currentUser = useCurrentUser();

  const features: FeatureType[] = useMemo(
    () => [
      {
        title: t('home:features.feature1.title'),
        text: t('home:features.feature1.description'),
        icon: FcDeleteDatabase,
      },
      {
        title: t('home:features.feature2.title'),
        text: t('home:features.feature2.description'),
        icon: FcMultipleInputs,
      },
      {
        title: t('home:features.feature3.title'),
        text: t('home:features.feature3.description'),
        icon: FcPositiveDynamic,
      },
    ],
    [t],
  );

  useEffect(() => {
    if (currentUser) {
      router.replace(getRoute('PlaylistsIndex'));
    }
  }, [currentUser]);

  return (
    <>
      <NextSeo title="Home" />
      <VStack as={Container} minH="100vh" maxW="5xl" py="4">
        <Flex justify="center">
          <Logo size="lg" />
        </Flex>

        <VStack as={Center} flex={1} mt="12" spacing="8">
          <VStack textAlign="center" spacing="4">
            <Trans
              i18nKey="home:title"
              components={{
                h1: <Heading as="h1" />,
                span: <Box as="span" color="spotify.500" />,
              }}
            />
            <Text color="gray.500">{t('home:subtitle')}</Text>
          </VStack>

          <Button
            colorScheme="spotify"
            leftIcon={<Icon as={FaSpotify} />}
            onClick={onSignIn}
            size="lg"
            variant="solid"
          >
            {t('common:signIn')}
          </Button>

          <FeatureGrid features={features} mt="12" />
        </VStack>
      </VStack>
    </>
  );
};

export default Home;
