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
    discogs: {
        country: string,
        id: number,
        type: string,
        master_id: number,
        master_url: string,
        uri: string,
        catno: string,
        title: string,
        thumb: string,
        cover_image: string,
        resource_url: string,
        format_quantity: number,
        urls: [
            {
                id: number,
                uri: string
            }
        ],
        len: number,
        tracks: [
            {
                position: string,
                type_: string,
                title: string,
                duration: string
            }
        ]
    },
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