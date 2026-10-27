import {
    Alert,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useFavorites } from "../hooks/useFavorites";

export default function Favorite() {
  const { data, isLoading, isError, error } = useFavorites();

  if (isLoading) {
    return (
      <View>
        <Text>Cargando Mis Favoritos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Error: {error?.message}</Text>
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
});
