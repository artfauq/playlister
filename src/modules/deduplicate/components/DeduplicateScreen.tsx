import React, { useEffect, useMemo, useState } from 'react';

import { Box, Button, Heading, HStack, useSteps } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

import { useAppTranslation } from '@src/hooks';
import { spotifyApi } from '@src/lib';
import { usePlaylistsContext } from '@src/modules/playlists';
import { mapObjectsByKey } from '@src/utils';

import { DeduplicateResult } from './DeduplicateResult';
import { SelectSinglePlaylistStep } from './SelectSinglePlaylistStep';

export const DeduplicateScreen: React.FC = () => {
  const { t } = useAppTranslation();
  const playlists = usePlaylistsContext();
  const queryClient = useQueryClient();
  const [sourcePlaylistId, setSourcePlaylistId] = useState<string>();
  // const [targetPlaylistIds, setTargetPlaylistIds] = useState<string[]>([]);

  const steps = [
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
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const isActiveStepValid = useMemo(() => {
    switch (activeStep) {
      case 1:
        return !!sourcePlaylistId;

      // case 2:
      //   return targetPlaylistIds.length > 0;

      default:
        return true;
    }
  }, [activeStep, sourcePlaylistId]);

  const prefetchPlaylistTracks = async (playlistId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['playlists', playlistId, 'tracks'],
      queryFn: async () => spotifyApi.fetchPlaylistTracks(playlistId),
    });
  };

  useEffect(() => {
    if (sourcePlaylistId) {
      prefetchPlaylistTracks(sourcePlaylistId);
    }
  }, [sourcePlaylistId]);

  return (
    <>
      <Heading as="h1">{t('navigation:deduplicate')}</Heading>
      {/* <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step
            key={step.title}
            onClick={index + 1 < activeStep ? () => setActiveStep(index + 1) : undefined}
          >
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper> */}

      {activeStep === 1 && (
        <SelectSinglePlaylistStep
          onSelect={setSourcePlaylistId}
          selectedPlaylistId={sourcePlaylistId}
        />
      )}
      {/* {activeStep === 2 && (
        <SelectMultiplePlaylistStep
          onSelect={setTargetPlaylistIds}
          selectedPlaylistIds={targetPlaylistIds}
        />
      )} */}
      {activeStep === 2 && sourcePlaylistId && (
        <DeduplicateResult
          sourcePlaylistId={sourcePlaylistId}
          targetPlaylistIds={mapObjectsByKey(playlists, 'id')}
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
