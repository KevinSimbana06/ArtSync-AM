import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { onlineManager, QueryClient } from "@tanstack/react-query";
import * as Network from "expo-network";
import { Platform } from "react-native";
import { Artwork } from "../types/art";
import { InfoArtAService } from "./mockcl/info-art.service";
import { mutationKeys } from "./queryKeys";

/**
 * 24 Horas en milisegundos para sincronizar gcTime y maxAge del persister
 */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24;

/**
 * Configuración de onlineManager con expo-network
 * Permite a TanStack Query pausar y reanudar mutaciones automáticamente según la conectividad.
 */
export function setupOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      window.addEventListener
    ) {
      const handleOnline = () => setOnline(true);
      const handleOffline = () => setOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }

    const updateState = (online: boolean) => {
      const time = new Date().toLocaleTimeString("es-ES", { hour12: false });
      console.log(
        `[${time}] ${online ? "📶 [Red] En línea (ONLINE) - Conexión activa" : "📵 [Red] Sin conexión (OFFLINE) - Modo local activado"}`,
      );
      setOnline(online);
    };

    let isMounted = true;
    Network.getNetworkStateAsync()
      .then((state) => {
        if (isMounted) {
          const isOnline = Boolean(
            state.isConnected && state.isInternetReachable !== false,
          );
          updateState(isOnline);
        }
      })
      .catch(() => {});

    const subscription = Network.addNetworkStateListener((event) => {
      const isOnline = Boolean(
        event.isConnected && event.isInternetReachable !== false,
      );
      updateState(isOnline);
    });

    return () => {
      isMounted = false;
      subscription?.remove?.();
    };
  });
}

// Inicializar listener de red
setupOnlineManager();

/**
 * Creación del persister con AsyncStorage
 */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
  key: "ARTSYNC_OFFLINE_CACHE_V1",
});

/**
 * Instancia global de QueryClient
 * - gcTime igual a CACHE_MAX_AGE (24h) para evitar discrepancias con el persister
 * - networkMode: 'offlineFirst' para queries (permite cargar caché offline)
 * - networkMode: 'online' para mutaciones (se pausan sin conexión y se reanudan al volver)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: CACHE_MAX_AGE,
      networkMode: "offlineFirst",
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      gcTime: CACHE_MAX_AGE,
      networkMode: "online",
    },
  },
});

/**
 * Registrar funciones por defecto para mutaciones (setMutationDefaults)
 * Es indispensable para que al reanudar mutaciones pausadas guardadas en AsyncStorage
 * TanStack Query pueda recuperar la función ejecutora correspondiente a la clave.
 */
queryClient.setMutationDefaults(mutationKeys.favorites.add, {
  mutationFn: async (variables: unknown) => {
    const time = new Date().toLocaleTimeString("es-ES", { hour12: false });
    console.log(
      `[${time}]  [MutationDefaults] Ejecutando mutación persistida 'favorites.add'...`,
    );
    return await InfoArtAService.add(variables as Omit<Artwork, "id">);
  },
});

queryClient.setMutationDefaults(mutationKeys.favorites.edit, {
  mutationFn: async (variables: unknown) => {
    const time = new Date().toLocaleTimeString("es-ES", { hour12: false });
    console.log(
      `[${time}]  [MutationDefaults] Ejecutando mutación persistida 'favorites.edit'...`,
    );
    return await InfoArtAService.update(
      variables as Partial<Artwork> & { id: string | number },
    );
  },
});
