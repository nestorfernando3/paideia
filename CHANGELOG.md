# Changelog

Todas las actualizaciones notables de este proyecto serán documentadas en este archivo.

## [1.3.0] - 2026-02-19

### Añadido
- **Barra de Progreso Visual**: Los estudiantes ahora ven su posición en el flujo guiado con indicadores de puntos y líneas conectoras.
- **Botón de Navegación Premium**: Botón "Siguiente" con gradiente dorado, efecto shimmer al hover y animación pulse-glow.
- **Botón Finalizar Sesión**: Botón verde al final del flujo guiado que permite a los estudiantes cerrar la sesión limpiamente.
- **Badge de Rol**: El header muestra "Docente" (dorado) o "Estudiante" (azul) junto a la info de sesión.
- **Micro-animaciones**: 7 nuevos keyframes (`bounceSoft`, `pulseGlow`, `cardEnter`, etc.) + 8 utilidades de stagger delay.
- **Animación de Éxito**: El formulario de ingreso muestra un checkmark verde antes de redirigir al estudiante.
- **Loading Animado**: Puntos dorados animados reemplazan el emoji estático durante la búsqueda de sesión.

### Mejorado
- **Touch Targets** (44px mínimo, WCAG AA) para accesibilidad móvil.
- **Back-nav** ampliado con fondo al hover y border-radius.
- **Safe-area** para dispositivos con notch (`env(safe-area-inset-bottom)`).
- **Input focus** con sombra interior sutil, borde de 1.5px y fondo blanco activo.
- **Card elevation** con sombras cálidas con tinte dorado.
- **Botones `:active`** con estado press-down para feedback táctil.
- **Home page** con animaciones de entrada escalonadas en tarjetas.
- **Subtítulo** con mejor contraste (opacity: 0.8).

### Corregido
- **Gnosis Loop**: Solucionado bug donde el flujo guiado enviaba al estudiante a la siguiente actividad sin haber completado la encuesta final.
- **Lógica de Finalización Inteligente**: El sistema ahora detecta si el estudiante ha participado en al menos una herramienta intermedia antes de permitir "Finalizar Sesión".
- **Gnosis Teacher "undefined"**: Corregido bug donde la vista del docente mostraba "undefined" por falta del objeto `tool` en `renderToolLayout`.

## [1.2.0] - 2026-02-18

### Añadido
- **Firebase Realtime Database**: Sincronización multi-dispositivo en tiempo real.
- **Autenticación Anónima**: Login automático transparente vía Firebase Anonymous Auth.
- **Modo Guiado**: Los estudiantes son redirigidos automáticamente al flujo de herramientas al unirse.
- **Shared Layout Component**: `layout.js` centraliza el header, back-nav y navegación de flujo para todas las herramientas.
- **Integración de Flujo**: Las 7 herramientas ahora usan `renderToolLayout` para navegación consistente.

### Mejorado
- **Almacenamiento Dual**: Escritura simultánea a Firebase y localStorage para resiliencia offline.
- **Vista del Estudiante**: UX de carga asíncrona al buscar sesiones en Firebase.

## [1.1.0] - 2026-02-18

### Añadido
- **Exportación a PDF**: Nueva funcionalidad para docentes que permite descargar un reporte completo de la sesión.
- **Diseño de Marca**: El reporte PDF ahora sigue la línea gráfica de Paideia (*fidelidad visual con la web*).
- **Persistencia de Nombres**: Se actualizó el sistema de almacenamiento para guardar el nombre del estudiante junto con cada respuesta individual.

### Corregido
- **Visibilidad de Datos**: Solucionado error crítico donde las columnas del PDF aparecían vacías debido a discrepancias en los nombres de las propiedades.
- **Compatibilidad**: Se añadió soporte para respuestas históricas (anteriores a la v1.1.0), mostrándolas como "Anónimo" pero preservando su contenido.
- **Producción**: Corregido bug de importación de `jspdf-autotable` que impedía la generación del documento en la versión desplegada.

## [1.0.0] - 2026-02-17

### Lanzamiento Inicial
- **7 Herramientas Pedagógicas**: Gnosis, Noesis, Eikasia, Aporia, Logos, Methexis, Anamnesis.
- **Tiempo Real**: Sincronización instantánea entre docente y estudiantes mediante Firebase Realtime Database.
- **Interfaz**: Diseño responsive inspirado en estética clásica (mármol, oro, tipografía serif).
- **Guías**: Manuales interactivos integrados para docentes y alumnos.
- **Compartir**: Generación automática de códigos QR para acceso rápido a sesiones.
