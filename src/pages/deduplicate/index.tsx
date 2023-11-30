import { NextPage } from 'next';
import React from 'react';

import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { DeduplicateScreen } from '@src/modules/deduplicate';
import { PlaylistsProvider } from '@src/modules/playlists';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(undefined);

const DeduplicatePlaylistPage: NextPage = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <NextSeo title={t('navigation:deduplicate')} />
      <Layout>
        <PlaylistsProvider>
          <DeduplicateScreen />
        </PlaylistsProvider>
      </Layout>
    </>
  );
};

export default DeduplicatePlaylistPage;
