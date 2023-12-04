import { NextPage } from 'next';
import React from 'react';

import { Card, Heading } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import { Layout, PlaylistTrackList } from '@src/components';
import { withAuthentication } from '@src/hocs';
import { useAppTranslation, useTopTracks } from '@src/hooks';
import { PlaylistsProvider } from '@src/modules/playlists';
import { SSRWrapperWithSession } from '@src/utils';

export const getServerSideProps = SSRWrapperWithSession(undefined);

const TopTracksPage: NextPage = () => {
  const { t } = useAppTranslation();
  const { data: topTracks } = useTopTracks();

  return (
    <PlaylistsProvider>
      <NextSeo title={t('navigation:topTracks')} />
      <Layout>
        <Heading as="h1">{t('navigation:topTracks')}</Heading>
        <Card flex={1}>
          <PlaylistTrackList tracks={topTracks} />
        </Card>
      </Layout>
    </PlaylistsProvider>
  );
};

export default withAuthentication(TopTracksPage);
