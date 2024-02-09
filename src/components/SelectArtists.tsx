import Artist from '../models/Artist'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

const SelectArtist = ({ items, handleSelectArtist, clearContent }: {
    items: Artist[], handleSelectArtist: (item: {
        id: string;
        name: string;
    }) => void, clearContent(): void

}) => {

    return (
        <ReactSearchAutocomplete
            items={items}
            autoFocus
            onSelect={handleSelectArtist}
            styling={
                {
                    height: '50px',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                    zIndex: 1000
                }
            }
            placeholder='Pesquise o Artista'
            onClear={
                () => {
                    clearContent();
                }
            }
        />
    );
}

export default SelectArtist;