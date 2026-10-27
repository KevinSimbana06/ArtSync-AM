import {
    useMutation,
    useMutationState,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { InfoArtAService } from "../api/mockcl/info-art.service";
import { CACHE_MAX_AGE } from "../api/queryClient";
import { mutationKeys, queryKeys } from "../api/queryKeys";
import { Artwork } from "../types/art";

/**
 * Consulta de lista de favoritos en MockAPI
 * - staleTime: 30 segundos (datos mutables específicos del usuario)
 * - gcTime: 24 horas (igual o mayor que maxAge del persister)
 */
export function useFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites.lists(),
    queryFn: () => InfoArtAService.getAll(),
    staleTime: 1000 * 30, // 30 segundos
    gcTime: CACHE_MAX_AGE, // 24 horas
  });
}

/**
 * Consulta de detalle de un favorito por ID
 * - staleTime: 30 segundos
 * - gcTime: 24 horas
 */
export function useFavoriteDetail(id: string | number) {
  return useQuery({
    queryKey: queryKeys.favorites.detail(id),
    queryFn: () => InfoArtAService.getById(id),
    staleTime: 1000 * 30,
    gcTime: CACHE_MAX_AGE,
    enabled: Boolean(id),
  });
}

/**
 * Mutación de CREACIÓN: Agregar a Favoritos
 * - mutationKey: mutationKeys.favorites.add
 * - Actualización optimista: Inserta inmediatamente el elemento con _isPending: true
 * - Invalida: queryKeys.favorites.lists()
 */
export function useAddFavorites() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.favorites.add,
    mutationFn: (art: Omit<Artwork, "id">) => InfoArtAService.add(art),
    onMutate: async (newArt) => {
      const time = new Date().toLocaleTimeString("es-ES", { hour12: false });
      console.log(
        `[${time}]  [Nueva Mutación] Creando nuevo registro: "${newArt.title}"`,
      );

      // Cancelar consultas salientes para evitar sobreescribir la actualización optimista
      await qc.cancelQueries({ queryKey: queryKeys.favorites.lists() });

      // Snapshot del estado previo
      const previousFavorites =
        qc.getQueryData<Artwork[]>(queryKeys.favorites.lists()) || [];

      // Elemento optimista temporal
      const tempId = `temp-${Date.now()}`;
      const optimisticArtwork: Artwork = {
        ...newArt,
        id: tempId,
        _isPending: true,
      };

      console.log(
        `[${time}]  [Optimistic UI] Mostrando en lista con ID temporal "${tempId}" y estado PENDIENTE (Offline).`,
      );

      // Aplicar optimista a la caché
      qc.setQueryData<Artwork[]>(queryKeys.favorites.lists(), [
        optimisticArtwork,
        ...previousFavorites,
      ]);

      return { previousFavorites };
    },
    onError: (_err, _newArt, context) => {
      const time = new Date().toLocaleTimeString("es-ES", { hour12: false });
      console.log(
        `[${time}] [Mutación Pausada/Error] La mutación no pudo completarse inmediatamente en el servidor. Permanece en cola local.`,
      );
      // Revertir a la versión anterior si falla
      if (context?.previousFavorites) {
        qc.setQueryData(queryKeys.favorites.lists(), context.previousFavorites);
      }
    },
    onSettled: () => {
      const time = new Date().toLocaleTimeString("es-ES", { hour12: false });
      console.log(
        `[${time}] [Sincronización Completada] Invalidando query de favoritos para sincronizar datos reales del servidor.`,
      );
      // Invalidar la lista de favoritos para sincronizar con MockAPI
      qc.invalidateQueries({ queryKey: queryKeys.favorites.lists() });
    },
  });
}

/**
 * Mutación de EDICIÓN: Editar un Favorito (Título / Nota personal)
 * - mutationKey: mutationKeys.favorites.edit
 * - Actualización optimista: Modifica el elemento en la caché con _isPending: true
 * - Invalida: queryKeys.favorites.lists() y queryKeys.favorites.detail(id)
 */
export function useEditFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.favorites.edit,
    mutationFn: (updatedArt: Partial<Artwork> & { id: string | number }) =>
      InfoArtAService.update(updatedArt),
    onMutate: async (updatedArt) => {
      // Cancelar consultas salientes
      await qc.cancelQueries({ queryKey: queryKeys.favorites.lists() });
      await qc.cancelQueries({
        queryKey: queryKeys.favorites.detail(updatedArt.id),
      });

      const previousFavorites =
        qc.getQueryData<Artwork[]>(queryKeys.favorites.lists()) || [];
      const previousDetail = qc.getQueryData<Artwork>(
        queryKeys.favorites.detail(updatedArt.id),
      );

      // Actualizar lista en caché optimísticamente
      qc.setQueryData<Artwork[]>(queryKeys.favorites.lists(), (old = []) =>
        old.map((item) =>
          String(item.id) === String(updatedArt.id)
            ? { ...item, ...updatedArt, _isPending: true }
            : item,
        ),
      );

      // Actualizar detalle en caché optimísticamente si existe
      if (previousDetail) {
        qc.setQueryData<Artwork>(queryKeys.favorites.detail(updatedArt.id), {
          ...previousDetail,
          ...updatedArt,
          _isPending: true,
        });
      }

      return { previousFavorites, previousDetail };
    },
    onError: (_err, updatedArt, context) => {
      // Revertir cambios en lista y detalle
      if (context?.previousFavorites) {
        qc.setQueryData(queryKeys.favorites.lists(), context.previousFavorites);
      }
      if (context?.previousDetail) {
        qc.setQueryData(
          queryKeys.favorites.detail(updatedArt.id),
          context.previousDetail,
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      // Invalidar tanto la lista como el detalle del elemento editado
      qc.invalidateQueries({ queryKey: queryKeys.favorites.lists() });
      qc.invalidateQueries({
        queryKey: queryKeys.favorites.detail(variables.id),
      });
    },
  });
}

/**
 * Hook para monitorear mutaciones pendientes o pausadas (offline)
 */
export function usePendingMutationsCount() {
  const pendingMutations = useMutationState({
    filters: { status: "pending" },
    select: (mutation) => mutation.state,
  });

  return pendingMutations.length;
}
