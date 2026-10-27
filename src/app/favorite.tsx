import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useEditFavorite, useFavorites } from '../hooks/useFavorites';
import { Artwork } from '../types/art';

export default function Favorite() {
    const { data, isLoading, isFetching, isError, error, refetch } = useFavorites();
    const { mutate: editFavorite, isPending: isEditing } = useEditFavorite();

    // Estado para el modal de edición
    const [selectedItem, setSelectedItem] = useState<Artwork | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editNote, setEditNote] = useState('');

    const openEditModal = (item: Artwork) => {
        setSelectedItem(item);
        setEditTitle(item.title);
        setEditNote(item.personal_note || '');
    };

    const handleSaveEdit = () => {
        if (!selectedItem) return;

        editFavorite(
            {
                id: selectedItem.id,
                title: editTitle.trim() || selectedItem.title,
                personal_note: editNote.trim(),
                artist_display: selectedItem.artist_display,
                image_id: selectedItem.image_id,
            },
            {
                onSuccess: () => {
                    Alert.alert('Éxito', 'Favorito actualizado y sincronizado.');
                    setSelectedItem(null);
                },
                onError: (err) => {
                    Alert.alert(
                        'Actualización guardada localmente',
                        'Los cambios se aplicaron en la app y se sincronizarán con MockAPI cuando se restablezca la conexión.'
                    );
                    console.log('Error o mutación pausada al editar:', err);
                    setSelectedItem(null);
                },
            }
        );
    };

    // Solo pantalla completa de carga si aún no existen datos en caché
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#e63946" />
                <Text style={styles.loadingText}>Cargando tus favoritos...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error al cargar favoritos: {error?.message}</Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </Pressable>
            </View>
        );
    }

    const favoritesList = data ?? [];

    return (
        <View style={styles.screen}>
            {/* Si ya hay datos en caché, se muestran inmediatamente mientras revalida el GET en segundo plano */}
            {isFetching && (
                <View style={styles.backgroundFetchBar}>
                    <ActivityIndicator size="small" color="#495057" style={{ marginRight: 6 }} />
                    <Text style={styles.backgroundFetchText}>
                        Mostrando datos de la caché • Sincronizando con MockAPI...
                    </Text>
                </View>
            )}

            {favoritesList.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyTitle}>No tienes favoritos guardados</Text>
                    <Text style={styles.emptySubtitle}>
                        {'Explora la Biblioteca y presiona "Agregar a favoritos".'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    style={styles.list}
                    data={favoritesList}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => {
                        const imageUrl = item.image_id
                            ? `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`
                            : null;

                        return (
                            <View style={styles.itemCard}>
                                {/* Indicador visual de cambio pendiente de sincronización */}
                                {item._isPending && (
                                    <View style={styles.pendingBadge}>
                                        <Text style={styles.pendingBadgeText}>
                                            ⏳ Pendiente de sincronización (Offline)
                                        </Text>
                                    </View>
                                )}

                                {imageUrl ? (
                                    <Image source={{ uri: imageUrl }} style={styles.itemImage} />
                                ) : (
                                    <View style={[styles.itemImage, styles.placeholderImage]}>
                                        <Text style={styles.placeholderText}>Sin imagen disponible</Text>
                                    </View>
                                )}

                                <Text style={styles.itemTitle}>{item.title}</Text>
                                {item.artist_display ? (
                                    <Text style={styles.itemArtist}>{item.artist_display}</Text>
                                ) : null}

                                {/* Nota personal si existe */}
                                {item.personal_note ? (
                                    <View style={styles.noteBox}>
                                        <Text style={styles.noteLabel}>📝 Nota personal:</Text>
                                        <Text style={styles.noteText}>{item.personal_note}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.actionsRow}>
                                    <Pressable
                                        style={styles.editButton}
                                        onPress={() => openEditModal(item)}
                                    >
                                        <Text style={styles.editButtonText}>
                                            ✏️ Editar favorito / nota
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        );
                    }}
                />
            )}

            {/* Modal para Editar Favorito */}
            <Modal
                visible={Boolean(selectedItem)}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedItem(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Favorito</Text>

                        <Text style={styles.inputLabel}>Título de la obra:</Text>
                        <TextInput
                            style={styles.textInput}
                            value={editTitle}
                            onChangeText={setEditTitle}
                            placeholder="Título"
                        />

                        <Text style={styles.inputLabel}>Nota o comentario personal:</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            value={editNote}
                            onChangeText={setEditNote}
                            placeholder="Escribe una apreciación o nota..."
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setSelectedItem(null)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleSaveEdit}
                                disabled={isEditing}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isEditing ? 'Guardando...' : 'Guardar cambios'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#555',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 15,
        color: '#d90429',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#e63946',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
    },
    backgroundFetchBar: {
        backgroundColor: '#e9ecef',
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundFetchText: {
        fontSize: 12,
        color: '#495057',
        fontWeight: '500',
    },
    itemCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    pendingBadge: {
        backgroundColor: '#fff3cd',
        borderWidth: 1,
        borderColor: '#ffeeba',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    pendingBadgeText: {
        color: '#856404',
        fontSize: 12,
        fontWeight: '700',
    },
    itemImage: {
        width: '100%',
        height: 230,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#e9ecef',
    },
    placeholderImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#868e96',
        fontSize: 13,
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 4,
    },
    itemArtist: {
        fontSize: 13,
        color: '#6c757d',
        marginBottom: 10,
    },
    noteBox: {
        backgroundColor: '#f1f3f5',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#457b9d',
    },
    noteLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#495057',
        marginBottom: 2,
    },
    noteText: {
        fontSize: 13,
        color: '#212529',
        fontStyle: 'italic',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    editButton: {
        backgroundColor: '#e8f4f8',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#b8d8e8',
    },
    editButtonText: {
        color: '#1d3557',
        fontSize: 13,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1d3557',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 6,
    },
    textInput: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        marginBottom: 14,
        color: '#212529',
    },
    textArea: {
        height: 70,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 6,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#e9ecef',
    },
    cancelButtonText: {
        color: '#495057',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#e63946',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});