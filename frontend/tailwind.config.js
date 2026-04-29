/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f5f5f5', // The general app background
        surface: '#ffffff',    // Card backgrounds
        primary: '#1E1E1E',    // Dark black/gray headers and buttons
        textmain: '#333333',   // Main text
        border: '#E5E7EB',     // Light borders
        success: '#10B981',    // Green for success/active
        error: '#EF4444',      // Red for error/high priority
        warning: '#F59E0B',    // Orange/Yellow for pending/medium
        info: '#3B82F6'        // Blue for low priority
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
