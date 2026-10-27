import { Artwork } from '../../types/art';
import { client } from './clientP';

const randomPage = Math.floor(Math.random() * 100) + 1;

interface ArtworksResponse {
    data: Artwork[];
}

export const ArtPublic = {
    getAll: async (): Promise<Artwork[]> => {
        const response = await client.get<ArtworksResponse>(`artworks?page=${randomPage}&limit=12&fields=id,title,artist_display,image_id`);
        return response.data.data;
    }
}