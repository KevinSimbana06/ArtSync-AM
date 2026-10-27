import {
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
  const { data, isLoading, isError, error } = useArt();
  const { mutateAsync: addFavorites, isPending } = useAddFavorites();

  const handleAddToFavorites = async (item: Artwork) => {
    addFavorites(
      {
        title: item.title,
        artist_display: item.artist_display,
        image_id: item.image_id,
      },
      {
        onSuccess: () => Alert.alert("Arte agregado a favoritos"),
        onError: (err) => {
          Alert.alert("Error al agregar el arte a favoritos");
          console.log(err);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Error: {error?.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1 }}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const imageUrl = item.image_id
          ? `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
          : null;

        return (
          <Pressable
            onPress={() => Alert.alert(item.title, item.artist_display)}
          >
            <View style={styles.itemCard}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.itemImage} />
              ) : null}
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.artist_display ? (
                <Text style={styles.itemArtist}>{item.artist_display}</Text>
              ) : null}
            </View>
            <Pressable
              style={styles.favoriteButton}
              onPress={() => handleAddToFavorites(item)}
              disabled={isPending}
            >
              <Text style={styles.favoriteButtonText}>
                {isPending ? "Agregando..." : "Agregar a favoritos"}
              </Text>
            </Pressable>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  itemCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  itemImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  itemArtist: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  favoriteButton: {
    marginTop: 12,
    backgroundColor: "#fff0f3",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ffccd5",
  },
  favoriteButtonText: {
    color: "#e63946",
    fontWeight: "600",
    fontSize: 14,
  },
});
