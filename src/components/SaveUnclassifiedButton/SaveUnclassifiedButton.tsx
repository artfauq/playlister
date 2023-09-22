import React, { useEffect } from 'react';

import { Button, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { useAppTranslation } from '@src/hooks';
import { SaveUnclassifiedResponse } from '@src/pages/api/playlists/save-unclassified';

type Props = {};

export const SaveUnclassifiedButton: React.FC<Props> = () => {
  const { t } = useAppTranslation();
  const toast = useToast();
  const {
    data,
    mutate: saveUnclassified,
    isLoading,
  } = useMutation({
    mutationFn: async () => {
      const res = await axios.post<SaveUnclassifiedResponse>('/api/playlists/save-unclassified');

      return res.data;
    },
  });

  useEffect(() => {
    console.log('data', data);

    if (data && !toast.isActive('save-unclassified')) {
      toast({
        id: 'save-unclassified',
        title: 'Save unclassified trackss',
        description: `Found ${data.toAddTracks?.length} tracks to add and ${data.toRemoveTracks?.length} tracks to remove`,
        duration: 10000,
        isClosable: true,
        status: 'success',
      });
    }
  }, [data, toast]);

  return (
    <Button
      colorScheme="teal"
      isLoading={isLoading}
      loadingText={t('common:refreshing')}
      onClick={() => saveUnclassified()}
      size="sm"
      variant="outline"
    >
      {t('playlists:saveUnclassified')}
    </Button>
  );
};
