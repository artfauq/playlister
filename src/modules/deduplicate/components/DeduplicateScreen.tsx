import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Button, Heading, HStack, useSteps } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@src/config';
import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';

import { DeduplicateResult } from './DeduplicateResult';
import { DeduplicateStepper } from './DeduplicateStepper';
import { SelectMultiplePlaylistStep } from './SelectMultiplePlaylistStep';
import { SelectSinglePlaylistStep } from './SelectSinglePlaylistStep';

export const DeduplicateScreen: React.FC = () => {
  const { t } = useAppTranslation();
  const queryClient = useQueryClient();
  const [sourcePlaylistId, setSourcePlaylistId] = useState<string>();
  const [targetPlaylistIds, setTargetPlaylistIds] = useState<string[]>([]);

  const steps = useMemo(
    () => [
      {
        title: t('deduplicate:steps.step1.title'),
        description: t('deduplicate:steps.step1.description'),
      },
      {
        title: t('deduplicate:steps.step2.title'),
        description: t('deduplicate:steps.step2.description'),
      },
      {
        title: t('deduplicate:steps.step3.title'),
        description: t('deduplicate:steps.step3.description'),
      },
    ],
    [t],
  );

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const isActiveStepValid = useMemo(() => {
    switch (activeStep) {
      case 1:
        return !!sourcePlaylistId;

      case 2:
        return targetPlaylistIds.length > 0;

      default:
        return true;
    }
  }, [activeStep, sourcePlaylistId, targetPlaylistIds.length]);

  const prefetchPlaylistTracks = useCallback(
    async (playlistId: string) => {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.playlists.tracks(playlistId).queryKey,
        queryFn: async () => spotifyApi.fetchPlaylistTracks(playlistId),
      });
    },
    [queryClient],
  );

  useEffect(() => {
    if (sourcePlaylistId) {
      prefetchPlaylistTracks(sourcePlaylistId);
    }
  }, [sourcePlaylistId]);

  return (
    <>
      <Heading as="h1">{t('navigation:deduplicate')}</Heading>
      <DeduplicateStepper activeStep={activeStep} steps={steps} onStepClick={setActiveStep} />

      {activeStep === 1 && (
        <SelectSinglePlaylistStep
          onSelect={setSourcePlaylistId}
          selectedPlaylistId={sourcePlaylistId}
        />
      )}
      {activeStep === 2 && (
        <SelectMultiplePlaylistStep
          onSelect={setTargetPlaylistIds}
          selectedPlaylistIds={targetPlaylistIds}
          sourcePlaylistId={sourcePlaylistId}
        />
      )}
      {activeStep === 3 && sourcePlaylistId && (
        <DeduplicateResult
          sourcePlaylistId={sourcePlaylistId}
          targetPlaylistIds={targetPlaylistIds}
        />
      )}

      <HStack justify="space-between" mt="auto">
        {activeStep > 1 ? (
          <Button
            onClick={() => setActiveStep(activeStep - 1)}
            colorScheme="spotify"
            isDisabled={activeStep === 1}
            variant="outline"
            w="7rem"
          >
            {t('common:back')}
          </Button>
        ) : (
          <Box />
        )}

        <Button
          onClick={() => setActiveStep(activeStep + 1)}
          colorScheme="spotify"
          isDisabled={!isActiveStepValid || activeStep === steps.length}
          variant="solid"
          w="7rem"
        >
          {t('common:next')}
        </Button>
      </HStack>
    </>
  );
};
