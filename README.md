# PAL Dashboard (UBS Style)

A modern, modular dashboard for work management, styled to UBS standards. This project integrates ServiceNow, communications, approvals, and more, with a cinematic, animated VoiceOverview module for real-time alerts.

## Features
- **VoiceOverview Module:**  Animated alerts for ServiceNow, communications, approvals, and more.
- **ServiceNow Integration:** Fetches and displays critical incidents, SLA status, and change tasks.
- **Modular UI:** Includes modules for communications, approvals, tasks, meetings, GitLab issues, and more.
- **UBS Branding:** Uses Frutiger 45 Light font, UBS color palette, and clean, modern design.
- **Responsive Design:** Works on desktop and mobile.

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd pal-red-dashboard-21-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - If you use API keys or tokens, create a `.env` file and add your credentials as needed.

## Running the Project

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open your browser and go to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Folder Structure

```
pal-red-dashboard-21-main/
├── src/
│   ├── components/         # React components (modules, UI, VoiceOverview, etc.)
│   ├── pages/              # Main pages (Index, NotFound)
│   ├── services/           # API service files (ServiceNowAPI, etc.)
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   └── ...
├── public/                 # Static assets (logo, favicon, etc.)
├── package.json            # Project metadata and scripts
├── README.md               # Project documentation
└── ...
```

## Customization
- **ServiceNow API:** Update your API endpoint and bearer token in the relevant service file.
- **Branding:** Adjust colors and fonts in `index.css` and `tailwind.config.ts` as needed.

## Contact
For questions or support, contact the project maintainer.

