import React, { useEffect } from 'react';

import { SimpleGrid, useCheckboxGroup } from '@chakra-ui/react';

import { SelectablePlaylist } from '@src/modules/deduplicate/components/SelectablePlaylist';
import { usePlaylists } from '@src/modules/playlists';

type Props = {
  onSelect: (playlistIds: string[]) => void;
  selectedPlaylistIds?: string[];
};

export const SelectMultiplePlaylistStep: React.FC<Props> = ({ onSelect, selectedPlaylistIds }) => {
  const playlists = usePlaylists();
  const { value, onChange: handleChange } = useCheckboxGroup({
    onChange: onSelect,
    value: selectedPlaylistIds,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a' && event.ctrlKey) {
        event.preventDefault();

        onSelect(playlists.map(playlist => playlist.id));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SimpleGrid minChildWidth={180} spacing={4}>
      {playlists.map(playlist => (
        <SelectablePlaylist
          key={playlist.id}
          playlist={playlist}
          isSelected={value.includes(playlist.id)}
          onSelect={handleChange}
        />
      ))}
    </SimpleGrid>
  );
};
