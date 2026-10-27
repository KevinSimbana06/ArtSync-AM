import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Biblioteca" }} />
        <Tabs.Screen name="favorite" options={{ title: "Mis Favoritos" }} />
      </Tabs>
    </QueryClientProvider>
  );
}
