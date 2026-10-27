import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Theme } from "../constants/theme";
import { useArt } from "../hooks/useArt";
import { useAddFavorites, useFavorites } from "../hooks/useFavorites";
import { Artwork } from "../types/art";

export default function App() {
  const { data, isLoading, isFetching, isError, error, refetch } = useArt();
  const { data: favorites } = useFavorites();
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorites();

  // ID del elemento específico que se está agregando actualmente
  const [addingId, setAddingId] = useState<string | number | null>(null);

  // Estado para el mensaje Toast tipo píldora del mockup
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddToFavorites = (item: Artwork) => {
    setAddingId(item.id);
    addFavorite(
      {
        title: item.title,
        artist_display: item.artist_display,
        image_id: item.image_id,
      },
      {
        onSuccess: () => {
          setAddingId(null);
          showToast(`"${item.title}" se guardó en tus favoritos.`);
        },
        onError: () => {
          setAddingId(null);
          showToast(`"${item.title}" guardado localmente (Offline).`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando colección de arte...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error al cargar obras: {error?.message}
        </Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Barra sutil de revalidación en segundo plano */}
      {isFetching && (
        <View style={styles.backgroundFetchBar}>
          <ActivityIndicator
            size="small"
            color={Theme.colors.primary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.backgroundFetchText}>
            Mostrando datos de la caché • Actualizando catálogo...
          </Text>
        </View>
      )}

      <FlatList
        style={styles.list}
        data={data ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>COLECCIÓN</Text>
            <Text style={styles.mainTitle}>Biblioteca de Arte</Text>
          </View>
        }
        renderItem={({ item }) => {
          const imageUrl = item.image_id
            ? `https://www.artic.edu/iiif/2/${item.image_id}/full/600,/0/default.jpg`
            : null;

          // Verificar solo si este elemento específico ya está en favoritos
          const isSaved = Boolean(
            item.title &&
            favorites?.some(
              (fav) =>
                (fav.image_id &&
                  item.image_id &&
                  String(fav.image_id) === String(item.image_id)) ||
                (fav.title &&
                  fav.title.trim().toLowerCase() ===
                    item.title.trim().toLowerCase()),
            ),
          );

          // Solo está cargando este botón específico
          const isCurrentAdding = isAdding && addingId === item.id;

          return (
            <View style={styles.card}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text style={styles.placeholderText}>IMAGEN DE LA OBRA</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <Text style={styles.artworkTitle}>{item.title}</Text>
                {item.artist_display ? (
                  <Text style={styles.artistName}>{item.artist_display}</Text>
                ) : null}

                <View style={styles.actionsRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.favoriteButton,
                      isSaved && styles.favoriteButtonSaved,
                      pressed && !isSaved && styles.favoriteButtonPressed,
                      isCurrentAdding && styles.favoriteButtonDisabled,
                    ]}
                    onPress={() => handleAddToFavorites(item)}
                    disabled={isSaved || isCurrentAdding}
                  >
                    <Text
                      style={[
                        styles.favoriteButtonText,
                        isSaved && styles.favoriteButtonTextSaved,
                      ]}
                    >
                      {isCurrentAdding
                        ? "⏳ Guardando..."
                        : isSaved
                          ? "★ En favoritos"
                          : "★ Agregar a favoritos"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Notificación Toast elegante según el diseño */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    color: Theme.colors.primary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  mainTitle: {
    fontFamily: Theme.typography.fontTitle,
    fontSize: 32,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardImage: {
    width: "100%",
    height: 220,
    backgroundColor: Theme.colors.imagePlaceholder,
  },
  placeholderContainer: {
    width: "100%",
    height: 200,
    backgroundColor: Theme.colors.imagePlaceholder,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9C6872",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  cardContent: {
    padding: 18,
  },
  artworkTitle: {
    fontFamily: Theme.typography.fontTitle,
    fontSize: 22,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
    lineHeight: 28,
    marginBottom: 6,
  },
  artistName: {
    fontFamily: Theme.typography.fontBody,
    fontSize: 14,
    fontWeight: "500",
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: Theme.colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: Theme.radius.sm,
    alignSelf: "flex-start",
  },
  favoriteButtonSaved: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  favoriteButtonPressed: {
    opacity: 0.85,
  },
  favoriteButtonDisabled: {
    opacity: 0.6,
  },
  favoriteButtonText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  favoriteButtonTextSaved: {
    color: Theme.colors.textOnPrimary,
  },
  toastContainer: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: Theme.colors.toastBackground,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: Theme.radius.full,
    maxWidth: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: Theme.colors.toastText,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  backgroundFetchBar: {
    backgroundColor: "#F7EFF1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundFetchText: {
    fontSize: 11,
    color: Theme.colors.primaryDark,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: Theme.colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 14,
    color: "#D90429",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Theme.radius.sm,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
