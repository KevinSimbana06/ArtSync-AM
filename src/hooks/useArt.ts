import { useQuery } from '@tanstack/react-query';
import { ArtPublic } from '../api/publicl/art.service';

const Key = 'artworks'


//GetAllArtworks

export function useArt() {
    return useQuery({
        queryKey: [Key],
        queryFn: () => ArtPublic.getAll(),
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}


