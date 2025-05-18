# Portafolio 3D

Este es un portafolio personal interactivo en 3D que utiliza Three.js para crear una experiencia visual única.

## Estructura del Proyecto

```
.
├── lib/                    # Librerías externas
│   ├── three.js/          # Three.js y sus componentes
│   │   ├── three.min.js
│   │   └── OrbitControls.js
│   └── html2canvas/       # HTML2Canvas para texturas
│       └── html2canvas.min.js
├── img/                   # Imágenes del proyecto
├── comentarios/          # Estilos adicionales
├── index.html            # Página principal
├── main.js              # Lógica principal de Three.js
└── cs.css               # Estilos principales
```

## Dependencias Locales

El proyecto utiliza las siguientes librerías locales:

- **Three.js (r128)**: Motor de gráficos 3D
  - three.min.js
  - OrbitControls.js (control de cámara)
- **HTML2Canvas**: Para generar texturas a partir de HTML

## Características

- Cubo 3D interactivo con información del portafolio
- Animaciones suaves y efectos visuales
- Buzón interactivo con animación
- Diseño responsivo
- Optimizado para rendimiento

## Desarrollo

Para modificar el proyecto:

1. Las librerías se encuentran en la carpeta `lib/`
2. La lógica principal está en `main.js`
3. Los estilos se dividen entre `cs.css` y `comentarios/styles.css`

## Notas

- Las librerías están versionadas localmente para mayor control y estabilidad
- Se mantiene Font Awesome desde CDN por su tamaño y actualizaciones frecuentes
- Las fuentes de Google se mantienen desde CDN por optimización
