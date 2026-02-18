# Changelog

Todas las actualizaciones notables de este proyecto serán documentadas en este archivo.

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
