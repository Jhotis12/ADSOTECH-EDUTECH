# ADSOTECH-EDUTECH

Plataforma de tecnología educativa construida con React, TypeScript y Vite. Esta plataforma brinda herramientas para que las instituciones educativas gestionen horarios, analicen datos educativos y ofrezcan apoyo al aprendizaje asistido por IA.

## Características

- **Autenticación de Usuario** - Sistema de inicio de sesión seguro con control de acceso basado en roles (estudiantes, rectores/administradores)
- **Vistas de Panel** - Paneles personalizados para diferentes tipos de usuarios:
  - Panel de Estudiante: Horario personal, seguimiento de progreso
  - Panel de Rector/Administrador: Vista institucional, analíticas
  - Panel de Análisis Educativo: Información basada en datos
- **Integración de IA** - Impulsado por la IA Gemini de Google para:
  - Análisis educativo y recomendaciones
  - Asistencia inteligente mediante chatbot
- **Calendario y Programación** - Calendario interactivo para gestionar horarios académicos
- **Generación de Documentos** - Creación de PDF para reportes y certificados
- **Diseño Responsivo** - Construido con TailwindCSS para interfaz amigable en móviles
- **Visualización de Datos** - Gráficos y tablas usando Recharts para métricas educativas

## Pila Tecnológica

- **Frontend**: React 19, TypeScript, Vite
- **Estilos**: TailwindCSS 4
- **Gestión de Estado**: React Context API
- **Backend**: Supabase (autenticación, base de datos)
- **IA**: API de Google Gemini
- **Componentes de UI**: 
  - React Big Calendar
  - Framer Motion (animaciones)
  - Lucide React (iconos)
- **Utilidades**:
  - JSPDF + AutoTable (generación de PDF)
  - Date-fns (manipulación de fechas)
  - Recharts (visualización de datos)

## Estructura del Proyecto

```
src/
├── components/      # Componentes UI reutilizables
│   ├── CalendarView.tsx
│   ├── ChatBot.tsx
│   ├── EducationalAnalysisDashboard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── pages/           # Componentes de página
│   ├── Login.tsx
│   ├── StudentDashboard.tsx
│   ├── RectorDashboard.tsx
│   ├── Analysis.tsx
│   └── ... (páginas de políticas)
├── context/         # Contextos de React
│   └── AuthContext.tsx
├── lib/             # Integraciones con servicios externos
│   ├── supabase.ts  # Cliente de Supabase
│   ├── gemini.ts    # Integración de IA Gemini
│   └── pdfGenerator.ts # Utilidades de generación de PDF
├── types/           # Definiciones de tipos TypeScript
└── utils/           # Funciones de utilidad
    └── fixSchedule.ts
```

## Cómo Empezar

1. Clone el repositorio
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Configure las variables de entorno en `.env`:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   VITE_GEMINI_API_KEY=tu_api_key_de_gemini
   ```
4. Inicie el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run lint` - Ejecutar ESLint
- `npm run preview` - Vista previa de la construcción de producción

## Variables de Entorno

Las siguientes variables de entorno son requeridas:

- `VITE_SUPABASE_URL` - URL del proyecto de Supabase
- `VITE_SUPABASE_ANON_KEY` - Clave anónima de Supabase
- `VITE_GEMINI_API_KEY` - Clave de API de Google Gemini

## Características en Detalle

### Autenticación
- Autenticación de usuario segura mediante Supabase
- Control de acceso basado en roles (Estudiante, Rector/Admin)
- Rutas protegidas basadas en roles de usuario

### Características de IA
- Panel de análisis educativo con insights generados por IA
- Chatbot conversacional para asistencia estudiantil
- Generación automática de reportes y recomendaciones

### Sistema de Calendario
- Calendario académico interactivo
- Creación y gestión de eventos
- Visualización de horarios para estudiantes y personal

### Análisis de Datos
- Visualización de métricas educativas
- Seguimiento de rendimiento a lo largo del tiempo
- Herramientas de análisis comparativo

## Contribuir

1. Haga un fork del repositorio
2. Cree su rama de característica (`git checkout -b feature/CaracteristicaAsombrosa`)
3. Confirme sus cambios (`git commit -m 'Agregar alguna CaracteristicaAsombrosa'`)
4. Empuje a la rama (`git push origin feature/CaracteristicaAsombrosa`)
5. Abra una Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - vea el archivo LICENSE para más detalles.

## Contacto

Para consultas, por favor contacte al equipo de desarrollo.