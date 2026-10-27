import { Artwork } from "../../types/art";
import { client } from "./clientM";

export const InfoArtAService = {
    getAll: async (): Promise<Artwork[]> => {
        const response = await client.get<Artwork[]>('/Favoritos');
        return response.data;
    },
    add: async (art: Omit<Artwork, 'id'>): Promise<Artwork> => {
        const response = await client.post<Artwork>('Favoritos', art);
        return response.data;
    },
}