import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InfoArtAService } from "../api/mockcl/info-art.service";
import { Artwork } from "../types/art";

const Key = "favorites";

//GetAllArtworks

export function useFavorites() {
    return useQuery({
        queryKey: [Key],
        queryFn: () => InfoArtAService.getAll(),
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}

//AddArtworkToFavorites

export function useAddFavorites() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (art: Omit<Artwork, 'id'>) => InfoArtAService.add(art),
        onSuccess: () => qc.invalidateQueries({ queryKey: [Key] })
    })
}
