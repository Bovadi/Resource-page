# Resources Portal

A vanilla JavaScript application with Supabase backend for managing educational resources and courses.

## Tech Stack

- **HTML5** - Structure
- **Tailwind CSS** - Styling (utility-first)
- **Vanilla JavaScript (ES6+)** - All interactivity
- **Supabase** - Database and authentication
- **Vite** - Development server and build tool

## Architecture

This project follows a component-based architecture without frameworks:

```
/
├── index.html              # App entry point
├── script.js               # Application controller
├── style.css               # Global CSS overrides
├── views/                  # Component partials
│   ├── header/
│   │   ├── header.html     # Header template
│   │   └── header.js       # Header logic
│   ├── sidebar/
│   ├── tabs/
│   ├── card-grid/
│   └── modal/
├── src/
│   ├── data/               # Sample data
│   ├── lib/                # Utilities (Supabase client)
│   └── services/           # Data services
└── public/                 # Static assets

```

Each component is self-contained with its own HTML template and JavaScript module.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- Supabase account and project

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (see `.env` for Supabase credentials)

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

## Component Structure

Each component follows this pattern:

- **HTML file**: Tailwind utility classes inline
- **JS file**: ES6 class with load(), event handlers, and state
- **CSS file** (optional): Only for animations or complex pseudo-selectors

## Data Management

- Supabase client for database operations
- Each component loads its own data
- No state management library needed
