import { useQuery } from "@tanstack/react-query";
import { ArtPublic } from "../api/publicl/art.service";
import { CACHE_MAX_AGE } from "../api/queryClient";
import { queryKeys } from "../api/queryKeys";

/**
 * Consulta de la API Pública (Art Institute of Chicago)
 *
 * Configuración de tiempos:
 * - staleTime: 15 minutos (datos estáticos/históricos que cambian rara vez)
 * - gcTime: 24 horas (igual al maxAge del persister para retención offline)
 */
export function useArt() {
  return useQuery({
    queryKey: queryKeys.publicArt.lists(),
    queryFn: () => ArtPublic.getAll(),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: CACHE_MAX_AGE, // 24 horas
  });
}
