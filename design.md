# 🎨 Guía de Estilo y Plantilla de Diseño: "Editorial Art Gallery"

Esta especificación describe la transformación visual de la aplicación hacia una estética de **Galería de Arte Editorial / Curaduría de Museo**. Se enfoca en tipografía de alto contraste (serif para títulos, sans-serif para metadatos), una paleta refinada en tonos carmesí/frambuesa con fondos claros, tarjetas con bordes suaves y componentes de feedback elegantes.

---

## 1. Sistema de Tokens de Diseño (Design Tokens)

Define estos tokens en tu archivo global de estilos o constantes de tema (ej. `src/constants/theme.ts`):

```typescript
export const Theme = {
  colors: {
    // Fondos
    background: '#FAF8F8',        // Blanco cálido / marfil de fondo general
    surface: '#FFFFFF',           // Blanco puro para tarjetas
    surfaceMuted: '#F4EFEF',      // Gris cálido para cajas de notas y callouts
    
    // Tonos Principales (Acento Galería)
    primary: '#D62261',           // Frambuesa / Carmesí vibrante para botones activos y kickers
    primaryLight: '#FCE4EC',      // Rosa pastel tenue para estados hover / badges
    primaryDark: '#B8144B',       // Carmesí profundo para texto activo

    // Textos
    textPrimary: '#1F1A1C',       // Carbón profundo para títulos principales
    textSecondary: '#665E62',     // Gris neutro medio para artistas y subtítulos
    textMuted: '#8E8589',         // Gris atenuado para fechas y metadatos
    textOnPrimary: '#FFFFFF',     // Blanco sobre botones de color
    
    // Elementos Específicos
    imagePlaceholder: '#F5C6CB',  // Rosa pastel empolvado para contenedor de imagen
    cardBorder: '#F0E6E8',        // Borde fino y sutil de tarjetas
    toastBackground: '#261619',   // Ciruela oscuro / espresso para snacks y alertas
    toastText: '#FFFFFF',
  },
  
  typography: {
    // Títulos de estilo museo (Serif de alto contraste)
    fontTitle: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    // Metadatos y lectura rápida (Sans-serif limpia)
    fontBody: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 20,
    full: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  }
};
