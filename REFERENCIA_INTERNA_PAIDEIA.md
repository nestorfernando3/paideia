# Referencia Interna: Proyecto Paideia (Παιδεία)

> **Propósito de este documento**: Servir como fuente de referencia interna exhaustiva para la construcción de un artículo académico sobre Paideia. Contiene toda la información técnica, pedagógica, filosófica y funcional del proyecto.

---

## 1. Identidad del Proyecto

| Campo | Detalle |
| --- | --- |
| **Nombre** | Paideia (Παιδεία) |
| **Subtítulo** | Suite de herramientas pedagógicas para el florecimiento del aprendizaje |
| **Tipo** | Aplicación web progresiva (PWA) |
| **Repositorio** | [github.com/nestorfernando3/paideia](https://github.com/nestorfernando3/paideia) |
| **Demo en vivo** | [nestorfernando3.github.io/paideia](https://nestorfernando3.github.io/paideia/) |
| **Licencia** | MIT © 2025 |
| **Versión actual** | v1.4.0 (marzo 2026) |
| **Localización** | Español colombiano (`es_CO`) |
| **Autor/Desarrollador** | Nestor Fernando (nestorfernando3) |

### 1.1 Concepto Central

Paideia es una aplicación web inspirada en la tradición griega de formación integral (*παιδεία*). Permite a docentes y estudiantes interactuar en tiempo real durante las clases a través de **7 herramientas pedagógicas** diseñadas para mejorar la **metacognición**, la **comprensión** y la **reflexión**.

El nombre "Paideia" proviene del concepto griego clásico que designaba el proceso de formación integral del ciudadano —intelectual, moral y física— considerado el ideal educativo más alto de la Antigua Grecia.

### 1.2 Problema que Resuelve

- **Falta de retroalimentación en tiempo real** durante las clases presenciales.
- **Barrera social** para que los estudiantes expresen dudas ("miedo a parecer que no entiendo").
- **Ausencia de herramientas metacognitivas** accesibles en contextos de aula.
- **Desconexión entre contenido y experiencia personal** del estudiante.
- **Dificultad para medir el crecimiento perceptivo** del estudiante durante una sesión.
- **Brecha digital**: muchas instituciones carecen de internet estable → modo local offline.

---

## 2. Las 7 Herramientas Pedagógicas

Las herramientas están nombradas con conceptos fundamentales de la filosofía griega y cubren las tres fases temporales de una clase.

### 2.1 Tabla Resumen

| # | Herramienta | Griego | Traducción | Propósito Pedagógico | Fase |
| --- | --- | --- | --- | --- | --- |
| 1 | **Gnosis** | Γνώσις | Conocimiento | Autoevaluación metacognitiva (pre/post) | Antes / Después |
| 2 | **Eikasia** | Εἰκασία | Imaginación/Conjetura | Conjetura e hipótesis predictivas | Antes |
| 3 | **Aporia** | Ἀπορία | Dificultad/Duda | Dudas anónimas en tiempo real | Durante |
| 4 | **Noesis** | Νόησις | Comprensión/Pensamiento puro | Pulso de comprensión instantáneo | Durante |
| 5 | **Methexis** | Μέθεξις | Participación/Conexión | Conexión interdisciplinaria | Después |
| 6 | **Logos** | Λόγος | Palabra/Razón | Cristalización en una palabra | Después |
| 7 | **Anamnesis** | Ἀνάμνησις | Recuerdo/Reminiscencia | Reflexión estructurada de cierre | Después |

### 2.2 Descripción Detallada de Cada Herramienta

#### 2.2.1 Gnosis (Γνώσις) — Autoconocimiento Metacognitivo

- **Pregunta**: "¿Qué tan seguro te sientes con el tema?" (escala 1-5)
- **Propósito**: Mide la percepción de seguridad del estudiante **antes** y **después** de la clase. Permite ver el crecimiento metacognitivo: ¿cambiaron las percepciones después del aprendizaje?
- **Uso docente**: Pedir que respondan al inicio de la clase (escala 1-5). Al final, repetir la encuesta. Comparar promedios del grupo.
- **Fundamento**: Metacognición — el estudiante observa su propia certeza y la contrasta consigo mismo.
- **Tiempo**: 3-5 minutos al inicio de la clase.
- **Ejemplo**: "Antes de clase: 2/5 (no sé mucho). Después: 4/5 (ahora entiendo mejor)."

#### 2.2.2 Eikasia (Εἰκασία) — Pensamiento Predictivo

- **Pregunta**: El profesor pregunta: "¿Qué crees que va a pasar?" y el estudiante escribe su predicción o conjetura.
- **Propósito**: Activa el pensamiento predictivo. Al formular hipótesis, los estudiantes se comprometen cognitivamente con el tema **antes** de la exposición.
- **Uso docente**: Antes de comenzar la explicación, pedir que cada estudiante escriba su predicción o conjetura. Al final de la clase, revisar grupalmente las hipótesis.
- **Fundamento**: Aprendizaje por descubrimiento; compromiso cognitivo temprano.
- **Tiempo**: 3-5 minutos al inicio de la clase.

#### 2.2.3 Aporia (Ἀπορία) — Canal de Dudas Anónimo

- **Funcionalidad**: Durante la clase, el estudiante puede indicar "Voy bien" o "Me perdí". También puede escribir dudas anónimas y votar por las dudas de otros compañeros.
- **Propósito**: Da voz a las dudas de forma anónima. Reduce la barrera social de "parecer que no entiendo". El indicador de confusión le dice al docente cuándo detenerse.
- **Uso docente**: Activar Aporia durante la explicación. Si la confusión sube del 60%, hacer pausa y aclarar.
- **Fundamento**: Evaluación formativa continua; eliminación de la barrera social.
- **Indicador clave**: Porcentaje de confusión del grupo en tiempo real.

#### 2.2.4 Noesis (Νόησις) — Pulso de Comprensión

- **Funcionalidad**: Verificación instantánea de comprensión individual.
- **Propósito**: Verificación instantánea de comprensión. Más rápido que "preguntar al aire" y más honesto porque es individual.
- **Fundamento**: Assessment for Learning — evaluación formativa inmediata.

#### 2.2.5 Methexis (Μέθεξις) — Conexión Interdisciplinaria

- **Pregunta**: El estudiante piensa en una materia, experiencia o situación donde el concepto aprendido también aplique, conectando lo aprendido con su mundo.
- **Propósito**: Fortalece el aprendizaje significativo al conectar el contenido con experiencias y conocimientos previos de los estudiantes.
- **Uso docente**: Pedir que piensen en otra materia, experiencia o situación de la vida donde el concepto también aplique. Compartir las conexiones más creativas con el grupo.
- **Fundamento**: Aprendizaje significativo (Ausubel); transferencia de conocimiento.

#### 2.2.6 Logos (Λόγος) — Síntesis en Una Palabra

- **Pregunta**: "Resume toda la clase en una sola palabra."
- **Propósito**: Obliga a la síntesis extrema. Elegir UNA palabra requiere procesar profundamente qué fue lo más importante de la clase.
- **Fundamento**: Pensamiento convergente; síntesis profunda.

#### 2.2.7 Anamnesis (Ἀνάμνησις) — Reflexión Estructurada

- **Estructura**: "Aprendí...", "Me pregunto...", "Lo conecté con..."
- **Propósito**: Estructura la reflexión en tres dimensiones: lo aprendido, lo que genera curiosidad, y las conexiones. Es el "ticket de salida" más completo.
- **Uso docente**: Usar como actividad de cierre. Leer reflexiones seleccionadas al día siguiente para abrir la nueva clase.
- **Fundamento**: Reflexión metacognitiva; continuidad entre sesiones.
- **Tiempo**: 5-8 minutos al final de la clase.

### 2.3 Flujo Pedagógico

Las herramientas siguen un orden pedagógico intencionado que replica las fases naturales de una sesión de aprendizaje:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  ANTES de la clase        DURANTE la clase        DESPUÉS de la clase   │
│  ─────────────────        ────────────────        ──────────────────    │
│  1. Gnosis (pre)          3. Aporia               5. Methexis          │
│  2. Eikasia               4. Noesis               6. Logos             │
│                                                    7. Anamnesis         │
│                                                    8. Gnosis (post)     │
└──────────────────────────────────────────────────────────────────────────┘
```

Este flujo se implementa como un **Flujo Guiado** (v1.3) donde los estudiantes son conducidos automáticamente de una herramienta a la siguiente, con una barra de progreso visual.

---

## 3. Arquitectura Técnica

### 3.1 Stack Tecnológico

| Tecnología | Rol |
| --- | --- |
| **Vite** | Build tool moderno (bundling, HMR) |
| **Vanilla JavaScript (ES Modules)** | Lógica de la aplicación — sin frameworks (React, Vue, etc.) |
| **CSS Custom Properties** | Sistema de diseño con 40+ tokens de diseño |
| **Supabase Postgres + Realtime** | Sincronización de datos en tiempo real (modo online) |
| **Supabase Anonymous Auth** | Autenticación transparente sin registro |
| **Socket.io** | Sincronización en tiempo real (modo local/offline) |
| **Express.js** | Servidor HTTP para modo local |
| **Electron** | Empaquetado como aplicación de escritorio |
| **jsPDF + AutoTable** | Generación de reportes PDF en el cliente |
| **QRCode** | Generación de códigos QR para compartir sesiones |
| **canvas-confetti** | Animaciones de celebración |
| **GitHub Actions** | CI/CD automático con GitHub Pages |

### 3.2 Modalidades de Despliegue

1. **Modo Online (Supabase)**: La aplicación se despliega en GitHub Pages. Los datos se sincronizan a través de Supabase Postgres + Realtime. Requiere conexión a internet.
2. **Modo Local (LAN)**: Un servidor Node.js + Socket.io se ejecuta en el computador del docente. Docente y estudiantes se conectan a la misma red WiFi. No requiere internet. Se muestra un distintivo "📡 MODO LOCAL" en la cabecera. Se genera QR con la IP local para que los estudiantes se conecten escaneando.
3. **Aplicación de Escritorio (Electron)**: Empaquetado como `.dmg` (macOS) y `.exe` (Windows) para distribución directa.

### 3.3 Flujo de Datos

```text
Estudiante (Navegador) ──► Supabase (Auth + Postgres + Realtime) ──► Docente (Navegador)
        │                               ▲                                 │
        └────────────── localStorage ───┘                                 │
                        (respaldo offline)               │
                                                         ▼
                                                    Reporte PDF
```

En modo local:

```text
Estudiante (Navegador) ──► Socket.io ──► Servidor Node.js ──► Docente (Navegador)
                                          (PC del docente)
```

### 3.3.1 Modelo de Datos Online

- **Tabla `sessions`**: almacena `code`, `topic`, `active_tools`, estado de actividad y marcas de tiempo.
- **Tabla `tool_entries`**: almacena cada respuesta individual con `session_code`, `tool_name`, `entry` y timestamps.
- **RLS**: las tablas usan Row Level Security para usuarios autenticados anónimamente.
- **Realtime**: `sessions` y `tool_entries` se publican en Supabase Realtime para refresco docente en vivo.

### 3.4 Roles de Usuario

| Rol | Capacidades |
| --- | --- |
| **Docente** | Crear sesiones, seleccionar herramientas, monitorear respuestas en tiempo real, exportar PDF, código de acceso protegido |
| **Estudiante** | Unirse a sesiones (código 4 letras o QR), responder herramientas, ser guiado por el flujo, completar reflexión final |

---

## 4. Diseño y Experiencia de Usuario

### 4.1 Identidad Visual

- **Estética**: Inspirada en la Antigua Grecia — mármol, oro, tipografía serif clásica.
- **Palette de colores**: Fondo oscuro-azul (`#1A1A2E`), acentos dorados, textura de mármol suave (`#F5F2EB`).
- **Tipografías**: Cormorant Garamond (serif, para títulos — evoca lo clásico) + Inter (sans-serif, para cuerpo — modernidad y legibilidad).
- **Iconografía**: Emojis griegos, símbolos filosóficos, decoraciones de meandro griego.

### 4.2 Accesibilidad

- **Touch targets** de 44px mínimo (WCAG AA) para accesibilidad móvil.
- **Safe-area** para dispositivos con notch (`env(safe-area-inset-bottom)`).
- Input con focus states de alto contraste.
- Diseño responsive adaptable a móvil, tablet y escritorio.

### 4.3 Micro-interacciones

- 7+ keyframes de animación: `bounceSoft`, `pulseGlow`, `cardEnter`, `shimmer`, etc.
- Stagger delays para entradas de tarjetas escalonadas.
- Animación de éxito (checkmark verde) al unirse a sesión.
- Loading animado con puntos dorados durante búsqueda de sesión.
- Botón "Siguiente" con gradiente dorado y efecto shimmer al hover.
- Confetti de celebración al completar el flujo.

---

## 5. Historial de Versiones

### v1.0.0 — 17 de febrero de 2026 (Lanzamiento Inicial)

- 7 herramientas pedagógicas completas.
- Sincronización en tiempo real vía Firebase.
- Interfaz responsive con estética clásica.
- Manuales interactivos integrados (guía docente y estudiante).
- Generación automática de códigos QR.

### v1.1.0 — 18 de febrero de 2026

- **Exportación a PDF** con diseño de marca Paideia.
- Persistencia de nombres de estudiantes junto a respuestas.
- Corrección de bugs de visibilidad de datos y compatibilidad.

### v1.2.0 — 18 de febrero de 2026

- **Firebase Realtime Database** completo.
- Autenticación anónima vía Firebase.
- **Modo Guiado**: redirección automática al flujo de herramientas.
- Shared Layout Component para navegación consistente.
- Almacenamiento dual (Firebase + localStorage para resiliencia offline).

### v1.3.0 — 19 de febrero de 2026

- **Barra de progreso visual** para el flujo guiado.
- **Botón "Siguiente"** premium con animaciones.
- **Badge de rol** (Docente/Estudiante).
- 7 nuevos keyframes de micro-animación.
- Corrección del "Gnosis Loop" (bug donde el flujo guiado enviaba al estudiante a la siguiente actividad sin completar la encuesta final).
- Lógica de Finalización Inteligente.

### v1.4.0 — 10 de marzo de 2026

- **Migración a Supabase** para el modo online.
- Nuevo esquema relacional con tablas `sessions` y `tool_entries`.
- Realtime docente conectado desde la aplicación, sin depender solo de refresh manual.
- Workflows de GitHub actualizados para construir con secrets `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Corrección del guardado del nombre del estudiante en las entradas.

---

## 6. Fundamentos Pedagógicos y Filosóficos

### 6.1 Marco Filosófico: La Paideia Griega

El concepto de *Paideia* (Παιδεία) en la tradición griega clásica se refiere al ideal de formación integral del ser humano. No se trata simplemente de instrucción o transmisión de conocimiento, sino de la cultivación del carácter, la virtud y la capacidad de pensamiento crítico. Werner Jaeger, en su obra monumental *Paideia: los ideales de la cultura griega* (1933-1947), describe este concepto como "el proceso de formación del hombre en su verdadera forma, la auténtica naturaleza humana."

El proyecto Paideia recupera esta visión al nombrar cada herramienta con un concepto fundamental de la filosofía griega, creando un puente entre la tradición filosófica antigua y las prácticas pedagógicas contemporáneas.

### 6.2 Fundamentos Pedagógicos Contemporáneos

La suite se alinea con múltiples marcos teóricos de la pedagogía moderna:

1. **Metacognición** (Flavell, 1979): Gnosis y Anamnesis promueven la conciencia del propio proceso de aprendizaje — "pensar sobre el pensar".
2. **Evaluación Formativa** (Black & Wiliam, 1998): Aporia y Noesis implementan Assessment for Learning en tiempo real, permitiendo al docente ajustar la instrucción sobre la marcha.
3. **Aprendizaje Significativo** (Ausubel, 1968): Methexis conecta el nuevo conocimiento con las estructuras cognitivas previas del estudiante y con contextos interdisciplinarios.
4. **Aprendizaje por Descubrimiento** (Bruner, 1961): Eikasia activa el compromiso cognitivo a través de la formulación de hipótesis antes de la exposición.
5. **Pensamiento Visible** (Ritchhart et al., 2011): Las 7 herramientas hacen visible el pensamiento del estudiante para sí mismo y para el docente.
6. **Ticket de Salida** (Exit Ticket): Anamnesis funciona como un ticket de salida estructurado en tres dimensiones (aprendí, me pregunto, lo conecté con).
7. **Taxonomía de Bloom revisada** (Anderson & Krathwohl, 2001): El flujo guiado progresa desde niveles bajos (recordar, comprender) hacia niveles altos (analizar, evaluar, crear).

### 6.3 Teorías de Aprendizaje Involucradas

| Herramienta | Teoría/Marco Principal | Autores |
| --- | --- | --- |
| Gnosis | Metacognición, autorregulación | Flavell (1979), Zimmerman (2002) |
| Eikasia | Aprendizaje por descubrimiento, constructivismo | Bruner (1961), Piaget |
| Aporia | Evaluación formativa, zona de desarrollo próximo | Black & Wiliam (1998), Vygotsky |
| Noesis | Assessment for Learning, feedback inmediato | Hattie & Timperley (2007) |
| Methexis | Aprendizaje significativo, transferencia | Ausubel (1968), Perkins & Salomon |
| Logos | Síntesis, pensamiento convergente | Bloom (1956), Guilford |
| Anamnesis | Reflexión metacognitiva, ritmo de aprendizaje | Schön (1983), Moon (2004) |

---

## 7. Contexto de Uso

### 7.1 Entorno Objetivo

- **País**: Colombia
- **Nivel educativo**: Educación secundaria (grados 6-11), potencialmente extensible a educación superior.
- **Contexto institucional**: Instituciones educativas públicas y privadas.
- **Modalidad**: Clases presenciales (la herramienta complementa, no reemplaza, la interacción docente-estudiante).

### 7.2 Flujo de una Sesión Típica

1. El docente abre Paideia y crea una sesión de clase con un tema.
2. Selecciona las herramientas que quiere activar para la sesión.
3. Comparte el código de 4 letras o el QR con los estudiantes.
4. Los estudiantes se unen desde sus dispositivos (celulares, tablets, computadores).
5. El Flujo Guiado conduce a los estudiantes automáticamente a través de las herramientas en el orden pedagógico.
6. El docente monitorea las respuestas en tiempo real.
7. Al finalizar, el docente descarga un reporte PDF con todas las respuestas.

### 7.3 Requerimientos de Infraestructura

**Modo Online:**

- Dispositivos con navegador web moderno (Chrome, Safari, Firefox).
- Conexión a internet (para Supabase).

**Modo Local (sin internet):**

- Un computador con Node.js (el del docente, actúa como servidor).
- Red WiFi local compartida (no necesita internet, solo LAN).
- Los estudiantes acceden a la IP del docente desde sus dispositivos.

---

## 8. Innovaciones Técnicas Destacables

### 8.1 Almacenamiento Dual (Resiliencia Offline)

La aplicación escribe simultáneamente a Supabase y a localStorage. Esto garantiza que si la conexión a internet se pierde momentáneamente, los datos del estudiante no se pierden.

### 8.2 Modo Local con QR

El servidor local genera automáticamente un certificado SSL autofirmado (librería `selfsigned`) y muestra un código QR con la dirección IP de la red local, eliminando la necesidad de que los estudiantes teclean manualmente la IP.

### 8.3 Autenticación Zero-Friction

Supabase Anonymous Auth permite que los estudiantes se unan sin registrarse, sin email, sin contraseña — simplemente ingresan un código de 4 letras y su nombre.

### 8.4 Progressive Web App (PWA)

Incluye `manifest.json` con soporte para instalación en pantalla de inicio en dispositivos móviles.

### 8.5 Generación de PDF en Cliente

Los reportes se generan completamente en el navegador del docente, sin necesidad de servidor backend para procesamiento. Esto respeta la privacidad de los datos estudiantiles.

---

## 9. Datos Relevantes para Citación Académica

### 9.1 Software

- **Nombre**: Paideia (Παιδεία)
- **Versión**: 1.4.0
- **URL**: <https://nestorfernando3.github.io/paideia/>
- **Repositorio**: <https://github.com/nestorfernando3/paideia>
- **Lenguaje**: JavaScript (ES Modules)
- **Fecha de lanzamiento**: 17 de febrero de 2026

### 9.2 Guías Disponibles

- [Guía del Docente](https://nestorfernando3.github.io/paideia/#/guia-docente) — Manual completo con tips pedagógicos.
- [Guía del Estudiante](https://nestorfernando3.github.io/paideia/#/guia-estudiante) — Instrucciones simples para alumnos.

### 9.3 Línea de Tiempo de Desarrollo

| Fecha | Evento |
| --- | --- |
| Febrero 2026 | Concepción e inicio del desarrollo |
| 17 feb 2026 | Lanzamiento v1.0.0 (7 herramientas + Firebase + QR) |
| 18 feb 2026 | v1.1.0 (Exportación PDF) |
| 18 feb 2026 | v1.2.0 (Firebase completo + Modo Guiado) |
| 19 feb 2026 | v1.3.0 (Flujo Guiado visual + Micro-animaciones + Accesibilidad) |
| 10 mar 2026 | v1.4.0 (Migración a Supabase + Realtime docente + endurecimiento de sesiones online) |

---

## 10. Posibles Líneas de Investigación

1. **Impacto en la metacognición** medido con Gnosis (pre/post) a lo largo de múltiples sesiones.
2. **Reducción de la barrera social** para expresar dudas (Aporia anónima vs. preguntas orales).
3. **Eficacia del flujo guiado** vs. herramientas sueltas en términos de participación estudiantil.
4. **Transferencia de conocimiento** observable a través de Methexis.
5. **Apropiación tecnológica** en contextos de baja conectividad (modo local).
6. **Evaluación formativa continua** y su efecto en el ajuste de la instrucción docente.
7. **Diseño de herramientas digitales** inspiradas en filosofía clásica: ¿el marco conceptual griego afecta la percepción del estudiante?
8. **Análisis de sentimiento** en las reflexiones de Anamnesis.
9. **Comparación con otras herramientas** (Kahoot, Mentimeter, Socrative) — ¿qué aporta la integración en flujo y el enfoque metacognitivo?
10. **Inclusión digital** en educación pública colombiana.
