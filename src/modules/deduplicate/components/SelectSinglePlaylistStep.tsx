import React from 'react';

import { SimpleGrid } from '@chakra-ui/react';

import { PlaylistCard } from '@src/components';
import { useAppTranslation } from '@src/hooks';
import { usePlaylistsContext } from '@src/modules/playlists';

type Props = {
  onSelect: (playlistId: string) => void;
  selectedPlaylistId?: string;
};

export const SelectSinglePlaylistStep: React.FC<Props> = ({ onSelect, selectedPlaylistId }) => {
  const { t } = useAppTranslation();
  const playlists = usePlaylistsContext();
  // const { value, onChange: handleChange } = useRadioGroup({
  //   name: 'playlist',
  //   onChange: onSelect,
  //   value: selectedPlaylistId,
  // });

  return (
    // <SimpleGrid minChildWidth={180} spacing={4}>
    //   {playlists.map(playlist => (
    //     <SelectablePlaylist
    //       key={playlist.id}
    //       playlist={playlist}
    //       isSelected={value === playlist.id}
    //       onSelect={handleChange}
    //     />
    //   ))}
    // </SimpleGrid>
    <SimpleGrid minChildWidth={220} spacing={8}>
      {playlists.map(playlist => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          isSelected={selectedPlaylistId === playlist.id}
          onClick={() => onSelect(playlist.id)}
        />
      ))}
    </SimpleGrid>
  );
};
