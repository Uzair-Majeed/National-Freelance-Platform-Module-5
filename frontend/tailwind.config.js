/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB', // Soft off-white
        surface: '#FFFFFF',    // Pure White
        'surface-alt': '#F3F4F6', // Light gray for internal contrast
        'surface-card': '#FFFFFF', 
        primary: '#1E1E1E',    // Solid Black
        textmain: '#1F2937',   // Dark gray-black for text
        border: '#9CA3AF',     // SLIGHTLY DARKER GRAY BORDER (GRAY-400)
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
