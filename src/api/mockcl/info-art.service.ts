import { Artwork } from "../../types/art";
import { client } from "./clientM";

export const InfoArtAService = {
  getAll: async (): Promise<Artwork[]> => {
    const response = await client.get<Artwork[]>("/Favoritos");
    return response.data;
  },

  getById: async (id: string | number): Promise<Artwork> => {
    const response = await client.get<Artwork>(`/Favoritos/${id}`);
    return response.data;
  },

  add: async (art: Omit<Artwork, "id">): Promise<Artwork> => {
    const response = await client.post<Artwork>("/Favoritos", art);
    return response.data;
  },

  update: async (
    art: Partial<Artwork> & { id: string | number },
  ): Promise<Artwork> => {
    const { id, ...data } = art;
    const response = await client.put<Artwork>(`/Favoritos/${id}`, data);
    return response.data;
  },
};
