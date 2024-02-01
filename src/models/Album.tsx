import Discogs from './Discogs';
interface AlbumData {

    id: string,
    releaseYear: number,
    artist: string,
    title: string,
    media: string,
    purchase: string,
    origin: string,
    editionYear: number,
    ifpiMastering: string,
    ifpiMould: string,
    barcode: string,
    matriz: string,
    lote: string,
    discogs: Discogs,
    spotify: {
        album_type: string,
        artists: null,
        external_urls: {
            spotify: string
        },
        href: string,
        id: string,
        images: null,
        name: string,
        release_date: string,
        release_date_precision: string,
        total_tracks: number,
        type: string,
        uri: string
    }
}

export default AlbumData;