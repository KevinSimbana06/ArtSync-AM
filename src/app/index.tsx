import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useArt } from "../hooks/useArt";
import { useAddFavorites } from "../hooks/useFavorites";
import { Artwork } from "../types/art";

export default function App() {
  const { data, isLoading, isFetching, isError, error, refetch } = useArt();
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorites();

  const handleAddToFavorites = (item: Artwork) => {
    addFavorite(
      {
        title: item.title,
        artist_display: item.artist_display,
        image_id: item.image_id,
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Agregado con éxito",
            `"${item.title}" se guardó en tus favoritos (sincronizado con MockAPI).`,
          );
        },
        onError: (err: any) => {
          Alert.alert(
            "Aviso de mutación",
            "El arte se guardó localmente y se sincronizará cuando haya conexión.",
          );
          console.log("Error o mutación pausada:", err);
        },
      },
    );
  };

  // Solo pantalla completa de carga si aún no existen datos en caché
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Cargando catálogo de arte...</Text>
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
      {/* Si ya hay datos en caché, se muestran inmediatamente mientras revalida el GET en segundo plano */}
      {isFetching && (
        <View style={styles.backgroundFetchBar}>
          <ActivityIndicator
            size="small"
            color="#555"
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
        renderItem={({ item }) => {
          const imageUrl = item.image_id
            ? `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
            : null;

          return (
            <View style={styles.itemCard}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>
                    Sin imagen disponible
                  </Text>
                </View>
              )}

              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.artist_display ? (
                <Text style={styles.itemArtist}>{item.artist_display}</Text>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.favoriteButton,
                  pressed && styles.favoriteButtonPressed,
                  isAdding && styles.favoriteButtonDisabled,
                ]}
                onPress={() => handleAddToFavorites(item)}
                disabled={isAdding}
              >
                <Text style={styles.favoriteButtonText}>
                  {isAdding ? "⏳ Agregando..." : "⭐ Agregar a favoritos"}
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 14,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 15,
    color: "#d90429",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backgroundFetchBar: {
    backgroundColor: "#e9ecef",
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundFetchText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "500",
  },
  itemCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: {
    width: "100%",
    height: 230,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#e9ecef",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#868e96",
    fontSize: 13,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 4,
  },
  itemArtist: {
    fontSize: 13,
    color: "#6c757d",
    marginBottom: 14,
  },
  favoriteButton: {
    backgroundColor: "#fff0f3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ffccd5",
  },
  favoriteButtonPressed: {
    backgroundColor: "#ffccd5",
  },
  favoriteButtonDisabled: {
    opacity: 0.6,
    backgroundColor: "#f8d7da",
  },
  favoriteButtonText: {
    color: "#e63946",
    fontWeight: "700",
    fontSize: 14,
  },
});
