# NFP Frontend - Collaboration Dashboard

## Technical Stack
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS + Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🎨 Design System
The frontend implements a **Tactical B&W Design System**:
- **Contrast**: High-contrast black (#000000) and white (#FFFFFF).
- **Typography**: Industrial sans-serif with heavy weights for headings.
- **Borders**: Thick 4px-6px black borders with sharp corners.
- **Shadows**: Hard, non-blurred "Brutalist" shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`).

## 📡 API Integration
All backend communication is centralized in `src/api.js`. It utilizes a simulated authentication header (`x-user-id`) to manage sessions across the platform.

## 🚀 Scripts

- `npm run dev`: Launch the Vite development server.
- `npm run build`: Compile the production bundle.
- `npm run preview`: Locally preview the production build.

## 📁 Key Directories

- `src/pages/`: Main application views (Dashboard, Settings, TaskBoard).
- `src/components/`: Reusable UI components (Sidebar, Header, LoadingSpinner).
- `src/context/`: Global state management for Workspaces.
- `src/assets/`: Static visual assets and fonts.

---
*Part of the National Freelance Platform ecosystem.*
