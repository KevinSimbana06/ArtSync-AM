/**
 * Jerarquía de claves de consulta para ArtSync
 * - Raíz del recurso (all)
 * - Listas (lists / list)
 * - Detalle por identificador (detail)
 * - Datos propios del usuario (mine)
 */

export const queryKeys = {
  publicArt: {
    all: ["public-art"] as const,
    lists: () => [...queryKeys.publicArt.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.publicArt.lists(), { ...(filters || {}) }] as const,
    details: () => [...queryKeys.publicArt.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.publicArt.details(), String(id)] as const,
  },
  favorites: {
    all: ["favorites"] as const,
    lists: () => [...queryKeys.favorites.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.favorites.lists(), { ...(filters || {}) }] as const,
    details: () => [...queryKeys.favorites.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.favorites.details(), String(id)] as const,
    mine: () => [...queryKeys.favorites.all, "mine"] as const,
  },
};

/**
 * Claves únicas para mutaciones (necesarias para setMutationDefaults y offline recovery)
 */
export const mutationKeys = {
  favorites: {
    all: ["favorites-mutation"] as const,
    add: ["favorites-mutation", "add"] as const,
    edit: ["favorites-mutation", "edit"] as const,
  },
};
