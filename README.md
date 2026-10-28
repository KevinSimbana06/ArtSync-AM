# ARTSYNC
Aplicación movil que permite explorar obras de clase mundial en tiempo real, al mismo tiempo crear una colecciona personalizable de estas obras.

## APIs de consumo
- MockAPI
- Art Institute of Chicago API

## Tecnologias aplicadas
- StanStack/Query
- react-native-async-storage/async-storage
- tanstack/query-async-storage-persister
- tanstack/react-query
- tanstack/react-query-persist-client
- expo-network

## Estructura de la jerarquía

- Raíz (all): ["public-art"] y ["favorites"]. Agrupa todo el dominio del recurso y permite invalidar o limpiar cualquier subconsulta relacionada si fuera necesario.
- Lista (lists / list): ["public-art", "list"] y ["favorites", "list"]. Identifica las colecciones completas que se muestran en las pantallas Biblioteca de Arte y Mis-Favoritos.
- Detalle por ID (details / detail(id)): ["favorites", "detail", String(id)]. Aísla en caché el estado individual de una obra específica identificada por su id.
- Datos propios (mine): ["favorites", "mine"]. Clave dedicada a los registros pertenecientes exclusivamente a la colección personal del usuario.

## APK
https://expo.dev/accounts/alexisk04/projects/ArtSync/builds/6de72212-23f2-44ce-a459-a7bb72c8480f
