export interface Artwork {
    id: string | number;
    title: string;
    artist_display: string;
    image_id: string | null;
    personal_note?: string;
    _isPending?: boolean;
}
