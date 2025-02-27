// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff', // White
        foreground: '#141414', // Dark Gray
        card: '#ffffff', // White
        'card-foreground': '#141414', // Dark Gray
        popover: '#ffffff', // White
        'popover-foreground': '#141414', // Dark Gray
        primary: '#00b4b4', // Teal
        'primary-foreground': '#ffffff', // White
        secondary: '#e0f7fa', // Light Teal
        'secondary-foreground': '#141414', // Dark Gray
        muted: '#e0f7fa', // Light Teal
        'muted-foreground': '#666666', // Gray
        accent: '#e0f7fa', // Light Teal
        'accent-foreground': '#141414', // Dark Gray
        destructive: '#ff4d4d', // Red
        'destructive-foreground': '#ffffff', // White
        border: '#e0e0e0', // Light Gray
        input: '#e0e0e0', // Light Gray
        ring: '#00b4b4', // Teal
      },
      borderRadius: {
        radius: '0.75rem',
      },
    },
  },
  plugins: [],
};