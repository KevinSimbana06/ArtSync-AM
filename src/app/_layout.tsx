// Inicializa Reactotron al arrancar la app
import '../api/reactotronConfig';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { asyncStoragePersister, CACHE_MAX_AGE, queryClient } from '../api/queryClient';
import { NetworkStatusBanner } from '../components/NetworkStatusBanner';

export default function RootLayout() {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: asyncStoragePersister,
                maxAge: CACHE_MAX_AGE,
            }}
            onSuccess={() => {
                // Llamar a resumePausedMutations() en el onSuccess del provider
                queryClient.resumePausedMutations();
            }}
        >
            <View style={{ flex: 1 }}>
                <NetworkStatusBanner />
                <Tabs
                    screenOptions={{
                        headerStyle: { backgroundColor: '#1a1a24' },
                        headerTintColor: '#ffffff',
                        tabBarStyle: { backgroundColor: '#1a1a24', borderTopColor: '#333' },
                        tabBarActiveTintColor: '#e63946',
                        tabBarInactiveTintColor: '#888',
                    }}
                >
                    <Tabs.Screen name="index" options={{ title: "Biblioteca de Arte" }} />
                    <Tabs.Screen name="favorite" options={{ title: "Mis Favoritos" }} />
                </Tabs>
            </View>
        </PersistQueryClientProvider>
    );
}
