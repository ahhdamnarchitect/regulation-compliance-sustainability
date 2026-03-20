# Missick - Regulation Compliance Platform

A comprehensive platform for tracking and managing global ESG regulations with search, filtering, and export capabilities.

## Features

- 🔍 **Searchable Database**: Find regulations by title, description, or keywords
- 🌍 **Global Coverage**: Regulations from multiple jurisdictions (US, EU, UK, Global)
- 🏷️ **Smart Filtering**: Filter by region, sector, framework, and status
- 📊 **User Dashboard**: Bookmark and manage regulations
- 📤 **Export Options**: Download data as CSV or PDF
- 👨‍💼 **Admin Panel**: Add, edit, and delete regulations
- 🔐 **Authentication**: Role-based access (Admin/User)
- ⚡ **Real-time Updates**: Automatic updates when data changes

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Supabase (Database + Auth)
- **Deployment**: GitHub Pages
- **PDF Generation**: jsPDF

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/regulation-compliance-sustainability.git
   cd regulation-compliance-sustainability
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional dependencies**
   ```bash
   npm install jspdf @types/jspdf --save-dev
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

7. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

## Deployment

### GitHub Pages (Free)

This project is configured for automatic deployment to GitHub Pages:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source
   - The workflow will automatically deploy on push to main

3. **Set up environment variables**
   - Go to repository Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Usage

### Demo Accounts

- **Admin**: `admin@missick.com` / `admin123`
- **User**: `user@missick.com` / `user123`

### Features

1. **Search Regulations**: Use the global search bar to find regulations
2. **Filter Results**: Use the filter panel to narrow down results
3. **Bookmark**: Click the bookmark icon to save regulations
4. **Export Data**: Download bookmarked regulations as CSV or PDF
5. **Admin Functions**: Add, edit, or delete regulations (admin only)

## Cursor Repo OS

This repository uses a persistent AI memory system so work can resume cleanly across sessions.

- Brain location: `brain/`
- Rules location: `.cursor/rules/`
- Command definitions: `cursor-os/commands.md`
- Bootstrap script: `scripts/init-cursor-os.py`

To resume work, start by reading `brain/current_state.md` and `brain/next_steps.md`, then continue from `Now`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, etc.)
│   ├── regulations/    # Regulation-specific components
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React contexts (Auth, App state)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Supabase, utils)
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── data/               # Mock data and constants
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.