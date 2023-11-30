import { NextPage } from 'next';
import React from 'react';

import { Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { PlaylistsProvider } from '@src/modules/playlists';
import { PlaylistList } from '@src/modules/PlaylistsPage';
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

export default PlaylistsPage;
