import { NextPage } from 'next';
import React from 'react';

import { Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { withAuthentication } from '@src/hocs';
import { useAppTranslation } from '@src/hooks';
import { PlaylistList, PlaylistsProvider } from '@src/modules/playlists';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(undefined);

const PlaylistsPage: NextPage = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <NextSeo title={t('playlists:title')} />
      <Layout>
        <PlaylistsProvider>
          <Heading as="h1">{t('playlists:title')}</Heading>
          <PlaylistList />
        </PlaylistsProvider>
      </Layout>
    </>
  );
};

export default withAuthentication(PlaylistsPage);
