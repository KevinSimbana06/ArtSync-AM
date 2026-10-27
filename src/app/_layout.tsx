// Inicializa Reactotron al arrancar la app
import '../api/reactotronConfig';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { asyncStoragePersister, CACHE_MAX_AGE, queryClient } from '../api/queryClient';
import { NetworkStatusBanner } from '../components/NetworkStatusBanner';
import { Theme } from '../constants/theme';

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
                        headerStyle: { backgroundColor: Theme.colors.background },
                        headerTintColor: Theme.colors.textPrimary,
                        headerTitleStyle: {
                            color: Theme.colors.textPrimary,
                            fontFamily: Theme.typography.fontTitle,
                        },
                        tabBarStyle: {
                            backgroundColor: Theme.colors.surface,
                            borderTopColor: Theme.colors.cardBorder,
                            height: 68,
                            paddingTop: 8,
                        },
                        tabBarActiveTintColor: Theme.colors.primary,
                        tabBarInactiveTintColor: Theme.colors.textMuted,
                        tabBarLabelStyle: {
                            fontFamily: Theme.typography.fontBody,
                            fontWeight: '700',
                        },
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: "Biblioteca de Arte",
                            tabBarIcon: ({ color, size }) => (
                                <SymbolView
                                    name={{
                                        ios: 'paintpalette.fill',
                                        android: 'palette',
                                        web: 'palette',
                                    }}
                                    tintColor={color}
                                    size={size}
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="favorite"
                        options={{
                            title: "Mis Favoritos",
                            tabBarIcon: ({ color, size }) => (
                                <SymbolView
                                    name={{
                                        ios: 'star.fill',
                                        android: 'star',
                                        web: 'star',
                                    }}
                                    tintColor={color}
                                    size={size}
                                />
                            ),
                        }}
                    />
                </Tabs>
            </View>
        </PersistQueryClientProvider>
    );
}
