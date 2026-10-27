import { useIsMutating } from "@tanstack/react-query";
import { useNetworkState } from "expo-network";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { usePendingMutationsCount } from "../hooks/useFavorites";

export function NetworkStatusBanner() {
  const network = useNetworkState();
  const isMutating = useIsMutating();
  const pendingCount = usePendingMutationsCount();

  const isOffline =
    network.isConnected === false || network.isInternetReachable === false;

  if (!isOffline && pendingCount === 0 && isMutating === 0) {
    return null;
  }

  if (isOffline) {
    return (
      <View style={[styles.banner, styles.offlineBanner]}>
        <Text style={styles.bannerText}>
          Sin conexión |{" "}
          {pendingCount > 0
            ? `${pendingCount} cambio(s) pendiente(s)`
            : "Modo Offline activo"}
        </Text>
      </View>
    );
  }

  if (pendingCount > 0 || isMutating > 0) {
    return (
      <View style={[styles.banner, styles.syncingBanner]}>
        <ActivityIndicator
          size="small"
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.bannerText}>
          Sincronizando cambios con MockAPI ({pendingCount || isMutating})...
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  offlineBanner: {
    backgroundColor: "#e76f51",
  },
  syncingBanner: {
    backgroundColor: "#2a9d8f",
  },
  bannerText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});
