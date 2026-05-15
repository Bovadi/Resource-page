module.exports = {
  content: [
    "./index.html",
    "./views/**/*.{html,js}",
    "./public/views/**/*.html",
    "./src/**/*.js",
    "./script.js",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      colors: {
        // Primary — teal scale (STYLE.md §3.1)
        primary: {
          50:  "#f0fafa",
          100: "#dff5f4",
          200: "#b1e3e2",
          300: "#86d1d0",
          400: "#43b0ae",
          500: "#108c89",
          600: "#0d8078",
          700: "#006360",
          800: "#065443",
          900: "#03402f",
          950: "#01291a",
        },
        // Coral / error (STYLE.md §3.1, §3.2)
        "bip-red": {
          50:  "#FCDDD4",
          100: "#fecaca",
          400: "#F0542A",
          500: "#CC3F19",
          600: "#dc2626",
          700: "#922D11",
        },
        // Info — bip-blue (STYLE.md §3.2)
        "bip-blue": {
          50:  "#e6f4fb",
          100: "#CCE9F7",
          200: "#b3ddf2",
          500: "#0093D8",
          700: "#006a9e",
        },
        // bip-green — alias scale used by canonical primary CTA pattern (STYLE.md §9.2)
        "bip-green": {
          50:  "#DBEEED",
          100: "#108C89",
        },
        // Warm surface tokens (STYLE.md §3.1)
        beige: "#F8F5EF",
        "beige-hover": "#F1EDE5",
        // Warm near-blacks (STYLE.md §3.1)
        "text-primary": "#343434",
        "text-muted": "#8A857D",
        "brand-black": "#161616",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
      fontSize: {
        "3xs": ["0.5rem", { lineHeight: "0.75rem" }],
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        "hover-card": "0 2px 8px rgba(0, 0, 0, 0.07)",
        "3xl": "0 24px 64px rgba(0, 0, 0, 0.25)",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
};
