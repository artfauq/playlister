import { NextPage } from 'next';
import React from 'react';

import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { PlaylistsProvider } from '@src/modules/playlists';
import { UnclassifiedTracksScreen } from '@src/modules/unclassified';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(undefined);

const UnclassifiedTracksPage: NextPage = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <NextSeo title={t('navigation:unclassifiedTracks')} />
      <Layout>
        <PlaylistsProvider>
          <UnclassifiedTracksScreen />
        </PlaylistsProvider>
      </Layout>
    </>
  );
};

export default UnclassifiedTracksPage;
