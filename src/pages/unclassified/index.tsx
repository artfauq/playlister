import { NextPage } from 'next';
import React from 'react';

import { NextSeo } from 'next-seo';

import { Layout } from '@src/components';
import { withAuthentication } from '@src/hocs';
import { useAppTranslation } from '@src/hooks';
import { PlaylistsProvider } from '@src/modules/playlists';
import { UnclassifiedTracksScreen } from '@src/modules/unclassified';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(undefined);

const UnclassifiedTracksPage: NextPage = () => {
  const { t } = useAppTranslation();

  return (
    <PlaylistsProvider>
      <NextSeo title={t('navigation:unclassifiedTracks')} />
      <Layout>
        <UnclassifiedTracksScreen />
      </Layout>
    </PlaylistsProvider>
  );
};

export default withAuthentication(UnclassifiedTracksPage);
