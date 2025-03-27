# Arquitectura de Lyra

Lyra es un sitio web estático diseñado para proporcionar análisis inteligente de sesiones parlamentarias. El proyecto está estructurado para ser desplegado en GitHub Pages, lo que requiere una arquitectura de sitio estático. Aquí está el desglose detallado:

## 1. Estructura de Directorios

```
/
├── assets/          - Contiene recursos multimedia
│   ├── logo.png     - Imagen del logo
│   └── prompt.txt   - Plantilla del prompt de IA
├── css/
│   └── styles.css   - Hoja de estilos única y completa
├── js/
│   └── generateSesiones.js - Script para generar archivos HTML de sesiones
├── sesiones/        - Contiene páginas de análisis de sesiones
│   ├── index.html   - Lista de todas las sesiones
│   ├── sesiones.json - Datos de todas las sesiones
│   └── [date]-[title].html - Páginas individuales de sesiones
├── prompt/
│   └── index.html   - Página que muestra el prompt de IA
└── index.html       - Página principal
```

## 2. Stack Tecnológico

- **Frontend**:
  - HTML, CSS y JavaScript puros (sin frameworks)
  - Arquitectura de sitio estático (compatible con GitHub Pages)
  - CSS moderno con variables, flexbox y grid
  - Diseño responsivo que soporta múltiples tamaños de dispositivo

- **Proceso de Construcción**:
  - Utiliza Node.js (generateSesiones.js) para generar páginas HTML estáticas
  - El contenido del sitio se pre-construye en lugar de generarse dinámicamente
  - Fuente de datos JSON (sesiones.json) para el contenido de las sesiones

## 3. Gestión de Contenido

- **Almacenamiento de Datos**:
  - Datos de sesiones almacenados en `sesiones/sesiones.json`
  - Cada sesión incluye metadatos (fecha, título, nivel de tensión) y secciones de contenido
  - Los archivos HTML estáticos se pre-generan a partir de estos datos

- **Proceso de Generación**:
  - `generateSesiones.js` utiliza operaciones del sistema de archivos de Node.js para:
    - Leer datos de sesiones desde JSON
    - Generar archivos HTML individuales para cada sesión
    - Crear páginas índice (índice principal e índice de sesiones)
    - Formatear fechas y crear slugs amigables para URLs

## 4. Sistema de Diseño

- **Tema Visual**:
  - Diseño inspirado en cyberpunk/tech con elementos brillantes
  - Esquema de colores usando variables CSS:
    - Primario: Cyan (#00eeff)
    - Secundario: Púrpura (#bf00ff)
    - Fondo: Azul oscuro (#0a0e17)
    - Paneles oscuros: #121824
  - Patrón de fondo en grid
  - Elementos animados (ej., efecto de pulso del anillo del logo)

- **Componentes**:
  - Encabezado con logo y línea de circuito
  - Menú de navegación
  - Tarjetas y listas de sesiones
  - Secciones de visualización de datos
  - Ajustes de diseño responsivo

## 5. Tipos de Páginas

- **Página Principal** (`index.html`):
  - Logo e introducción del sitio
  - Destacado de la última sesión
  - Caja de visualización del prompt de IA

- **Índice de Sesiones** (`sesiones/index.html`):
  - Lista cronológica de todas las sesiones
  - Indicadores de estado y metadatos para cada sesión

- **Páginas Individuales de Sesiones** (`sesiones/[date]-[title].html`):
  - Secciones estructuradas para:
    - Resumen breve
    - Temas principales
    - Decisiones clave
    - Recomendaciones accionables
    - Análisis retórico

- **Página de Prompt** (`prompt/index.html`):
  - Muestra la plantilla del prompt de IA usado para el análisis

## 6. Funcionalidad

- **Generación Estática**:
  - Todas las páginas se pre-generan en tiempo de construcción
  - No requiere procesamiento del lado del servidor
  - Contenido entregado tal cual a los navegadores

- **Integración con IA**:
  - El sistema utiliza IA para analizar transcripciones de sesiones parlamentarias
  - Plantilla de prompt estándar (`assets/prompt.txt`) guía el análisis de la IA
  - Formato de salida estructurado para presentación consistente

- **Navegación**:
  - Navegación jerárquica desde inicio a lista de sesiones a sesiones individuales
  - Enlaces "Volver" para fácil recorrido
  - Encabezado/pie de página consistente en todas las páginas

## 7. Consideraciones de Despliegue

- **Compatibilidad con GitHub Pages**:
  - Arquitectura completamente estática funciona con alojamiento en GitHub Pages
  - Sin dependencias del lado del servidor o generación dinámica de contenido
  - Todos los recursos están vinculados relativamente para resolución correcta de rutas

- **Rendimiento**:
  - Un solo archivo CSS (styles.css)
  - JavaScript mínimo (solo usado en tiempo de construcción)
  - Optimizado para carga rápida con solicitudes HTTP limitadas

## 8. Potencial de Expansión

- La estructura permite fácil adición de nuevas sesiones mediante:
  1. Agregar nuevas entradas a `sesiones.json`
  2. Ejecutar el script de generación para crear nuevos archivos HTML
  3. No requiere modificar la estructura existente del sitio

Esta arquitectura crea un sitio mantenible y de alto rendimiento que efectivamente sirve su propósito de mostrar análisis de sesiones parlamentarias en un formato organizado y accesible, mientras mantiene la compatibilidad con el alojamiento en GitHub Pages.
