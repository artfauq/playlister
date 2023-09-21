import React from 'react';

import { useCheckboxGroup, useRadioGroup, VStack } from '@chakra-ui/react';

import { PlaylistCard } from '@src/components/PlaylistCard';
import { Playlist } from '@src/types';

type BaseProps = {
  playlists: Playlist[];
};

type SingleSelectProps = BaseProps & {
  multiple?: false;
  onChange: (playlistId: string) => void;
};

type MultiSelectProps = BaseProps & {
  multiple: true;
  onChange: (playlistIds: string[]) => void;
};

type Props = SingleSelectProps | MultiSelectProps;

export const PlaylistSelect: React.FC<Props> = ({ multiple, playlists, onChange }) => {
  return (
    <VStack align="stretch">
      {multiple ? (
        <MultiSelect playlists={playlists} onChange={onChange} />
      ) : (
        <SingleSelect playlists={playlists} onChange={onChange} />
      )}
    </VStack>
  );
};

const SingleSelect: React.FC<Omit<SingleSelectProps, 'multiple'>> = ({ playlists, onChange }) => {
  const { value, onChange: handleChange } = useRadioGroup({ name: 'playlist', onChange });

  return playlists.map(playlist => (
    <PlaylistCard
      key={playlist.id}
      playlist={playlist}
      isSelected={value === playlist.id}
      onClick={() => handleChange(playlist.id)}
    />
  ));
};

const MultiSelect: React.FC<Omit<MultiSelectProps, 'multiple'>> = ({ playlists, onChange }) => {
  const { value, onChange: handleChange } = useCheckboxGroup({ onChange });

  return playlists.map(playlist => (
    <PlaylistCard
      key={playlist.id}
      playlist={playlist}
      isSelected={value.includes(playlist.id)}
      onClick={() => handleChange(playlist.id)}
    />
  ));
};
