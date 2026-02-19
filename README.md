# Paideia — Παιδεία

> Suite de herramientas pedagógicas para el florecimiento del aprendizaje

**Paideia** (Παιδεία) es una aplicación web inspirada en la tradición griega de formación integral. Permite a docentes y estudiantes interactuar en tiempo real durante las clases a través de 7 herramientas pedagógicas diseñadas para mejorar la metacognición, la comprensión y la reflexión.

## 🌿 Demo

👉 **[Abrir Paideia](https://nestorfernando3.github.io/paideia/)**

## 🏛️ Herramientas

| Herramienta | Griego | Propósito | Fase |
|---|---|---|---|
| **Gnosis** | Γνώσις | Autoevaluación metacognitiva | Antes / Después |
| **Eikasia** | Εἰκασία | Conjetura e hipótesis | Antes |
| **Aporia** | Ἀπορία | Dudas anónimas en tiempo real | Durante |
| **Noesis** | Νόησις | Pulso de comprensión instantáneo | Durante |
| **Methexis** | Μέθεξις | Conexión interdisciplinaria | Después |
| **Logos** | Λόγος | Cristalización en una palabra | Después |
| **Anamnesis** | Ἀνάμνησις | Reflexión estructurada | Después |

## 🚀 Uso Rápido

### Como Docente
1. Abre Paideia y haz clic en **"Crear sesión de clase"**
2. Ingresa el tema y selecciona las herramientas
3. Comparte el **código de 4 letras** o el **QR** con tus estudiantes
4. Monitorea las respuestas en tiempo real

### Como Estudiante
1. Abre Paideia y haz clic en **"Unirse como estudiante"**
2. Ingresa el código de la sesión
3. El sistema te guía automáticamente por las actividades de la clase
4. Al finalizar, completa tu reflexión final en Gnosis

## ✨ Características Principales

### 🔄 Flujo Guiado (v1.3)
Los estudiantes son guiados automáticamente a través de las herramientas activas de la sesión en el orden pedagógico correcto:
- **Barra de progreso visual** que muestra la posición del estudiante en el flujo
- **Botón "Siguiente"** con animación que lleva a la próxima actividad
- **Botón "Finalizar Sesión"** al completar todas las actividades
- Detección inteligente de participación antes de permitir el cierre

### 🎨 Diseño Premium (v1.3)
- Micro-animaciones: entradas escalonadas, pulse-glow en CTAs, shimmer en botones
- Touch targets de 44px (WCAG AA) para accesibilidad móvil
- Soporte para dispositivos con notch (safe-area)
- Badge de rol (Docente/Estudiante) en el header
- Inputs con focus state premium (sombra interior + fondo blanco)

### 🔥 Tiempo Real (v1.2)
- Sincronización multi-dispositivo mediante **Firebase Realtime Database**
- Autenticación anónima automática
- Código de acceso docente para proteger la creación de sesiones

### 📄 Exportación PDF (v1.1)
- Reportes profesionales descargables con un solo clic
- Diseño con la línea gráfica de Paideia
- Incluye todas las respuestas, dudas y reflexiones

## 🛠️ Tecnologías

- **Vite** — Build tool moderno
- **Vanilla JavaScript** — Sin frameworks, rendimiento máximo
- **CSS Custom Properties** — Sistema de diseño con 40+ tokens
- **Firebase** — Realtime Database + Anonymous Auth
- **QR Code** — Generación de códigos QR para compartir sesiones
- **GitHub Actions** — CI/CD automático con GitHub Pages
- **jsPDF + AutoTable** — Generación de reportes PDF en cliente

## 📡 Modo Local (Sin Internet)

Paideia incluye un servidor independiente que permite usar la aplicación en una red local (LAN) sin conexión a internet, utilizando tu computadora como servidor central.

### Requisitos
- Tener **Node.js** instalado en el computador del docente.
- Docente y Estudiantes deben estar conectados a la misma red WiFi.

### Iniciar en Modo Local

1. Abre tu terminal en la carpeta del proyecto.
2. Ejecuta el siguiente comando (esto construirá la app y lanzará el servidor):
   ```bash
   npm run start:local
   ```
3. La terminal mostrará dos direcciones:
   - **Local**: Para que el docente ingrese en su propia máquina.
   - **Network**: La dirección IP que debes compartir con los estudiantes.

> **Nota**: En modo local, verás un distintivo "📡 MODO LOCAL" en la cabecera. Los datos de la sesión se guardan temporalmente en la memoria del servidor y se perderán si cierras la terminal.

## 📦 Desarrollo Local

```bash
# Clonar
git clone https://github.com/nestorfernando3/paideia.git

# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

## 📖 Guías

- **[Guía del Docente](https://nestorfernando3.github.io/paideia/#/guia-docente)** — Manual completo con tips pedagógicos
- **[Guía del Estudiante](https://nestorfernando3.github.io/paideia/#/guia-estudiante)** — Instrucciones simples para alumnos

## 📝 Licencia

MIT © 2025
