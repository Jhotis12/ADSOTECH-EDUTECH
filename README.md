# ADSOTECH-EDUTECH

An educational technology platform built with React, TypeScript, and Vite. This platform provides tools for educational institutions to manage schedules, analyze educational data, and provide AI-assisted learning support.

## Features

- **User Authentication** - Secure login system with role-based access (students, rectors/admins)
- **Dashboard Views** - Customized dashboards for different user types:
  - Student Dashboard: Personal schedule, progress tracking
  - Rector/Admin Dashboard: Institutional overview, analytics
  - Educational Analysis Dashboard: Data-driven insights
- **AI Integration** - Powered by Google's Gemini AI for:
  - Educational analysis and recommendations
  - Intelligent chatbot assistance
- **Calendar & Scheduling** - Interactive calendar for managing academic schedules
- **Document Generation** - PDF creation for reports and certificates
- **Responsive Design** - Built with TailwindCSS for mobile-friendly interface
- **Data Visualization** - Charts and graphs using Recharts for educational metrics

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS 4
- **State Management**: React Context API
- **Backend**: Supabase (authentication, database)
- **AI**: Google Gemini API
- **UI Components**: 
  - React Big Calendar
  - Framer Motion (animations)
  - Lucide React (icons)
- **Utilities**:
  - JSPDF + AutoTable (PDF generation)
  - Date-fns (date manipulation)
  - Recharts (data visualization)

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── CalendarView.tsx
│   ├── ChatBot.tsx
│   ├── EducationalAnalysisDashboard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── pages/           # Page components
│   ├── Login.tsx
│   ├── StudentDashboard.tsx
│   ├── RectorDashboard.tsx
│   ├── Analysis.tsx
│   └── ... (policy pages)
├── context/         # React contexts
│   └── AuthContext.tsx
├── lib/             # External service integrations
│   ├── supabase.ts  # Supabase client
│   ├── gemini.ts    # Gemini AI integration
│   └── pdfGenerator.ts # PDF generation utilities
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
    └── fixSchedule.ts
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

The following environment variables are required:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GEMINI_API_KEY` - Google Gemini API key

## Features in Detail

### Authentication
- Secure user authentication via Supabase
- Role-based access control (Student, Rector/Admin)
- Protected routes based on user roles

### AI Features
- Educational analysis dashboard with AI-generated insights
- Conversational chatbot for student assistance
- Automated report generation and recommendations

### Calendar System
- Interactive academic calendar
- Event creation and management
- Schedule visualization for students and staff

### Data Analytics
- Visualization of educational metrics
- Performance tracking over time
- Comparative analysis tools

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For inquiries, please reach out to the development team.