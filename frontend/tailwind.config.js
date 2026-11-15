/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          forest: '#174D35',    // Primary Forest Green
          leaf: '#65A66C',      // Secondary Leaf Green
          gold: '#E8B75B',      // Accent Harvest Gold
          bg: '#F5F7F0',        // Canvas Background
          card: '#FFFFFF',      // Card Background
          text: '#172B22',      // Primary Text
          muted: '#738078',     // Secondary Text
          border: '#E5EAE3',    // Border
          success: '#239B65',   // Success
          warning: '#E8A33B',   // Warning
          danger: '#DC5555',    // Danger
          lightgreen: '#F0F7F2',
          lightgold: '#FDF8EC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(23, 77, 53, 0.06), 0 2px 6px -1px rgba(23, 77, 53, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(23, 77, 53, 0.12), 0 4px 10px -2px rgba(23, 77, 53, 0.06)',
      }
    },
  },
  plugins: [],
}
