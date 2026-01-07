# 🎲 GoblinMode

A Dungeons & Dragons themed video call website that allows users to create accounts, join campaigns/groups, manage character inventory and spellbooks, and participate in video calls with other players.

![D&D Video Calls](https://img.shields.io/badge/D%26D-Video%20Calls-success)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![Agora](https://img.shields.io/badge/Video-Agora%20RTC-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Running on Replit](#running-on-replit)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

---

## ✨ Features

- **User Authentication** - Create accounts and login with Firebase Authentication
- **Campaign Management** - Create and join D&D campaigns with friends
- **Video Calls** - Real-time video calls using Agora RTC
- **Character Inventory** - Manage your character's items and equipment
- **Spellbook** - Track your character's spells and abilities
- **D&D Theming** - Immersive fantasy-themed interface

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Vite + React + HTML/CSS |
| **Backend** | Express.js (Token Server) |
| **Video Calling** | Agora RTC SDK |
| **Authentication** | Firebase Authentication |
| **Database** | Firebase Realtime Database |
| **Storage** | Firebase Storage |
| **Build Tool** | Vite 5.x |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Agora Account** - [Sign up](https://www.agora.io/) to get App ID and Certificate
- **Firebase Project** - Already configured in the code

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd goblinmode
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_certificate_here
```

**Getting Agora Credentials:**
1. Go to [Agora Console](https://console.agora.io/)
2. Create a new project or select existing one
3. Copy your **App ID** and **App Certificate**
4. Paste them into your `.env` file

---

## 💻 Running Locally

### Option 1 (For Linux/Mac only): Quick Start (Single Command)

Run both frontend and backend simultaneously:

```bash
npm start
```

Then open **http://localhost:5000** in your browser.

### Option 2 (Windows): Manual Start (Two Terminals)

**Terminal 1 - Backend Server:**
```bash
npm run server
```
This starts the Agora token server on port 8000.

**Terminal 2 - Frontend:**
```bash
npm run dev
```
This starts the Vite dev server on port 5000.

Then open **http://localhost:5000** in your browser.

### Option 3: Using a Process Manager (Recommended for Development)

Install `concurrently`:
```bash
npm install --save-dev concurrently
```

Add to your `package.json` scripts:
```json
"dev:local": "concurrently \"npm run server\" \"npm run dev\""
```

Run with:
```bash
npm run dev:local
```

---

## ☁️ Running on Replit

The project is pre-configured to work seamlessly in Replit:

### Automatic Setup

1. Open the project in Replit
2. Add your Agora credentials to Replit Secrets:
   - Click on "Secrets" (lock icon) in the left sidebar
   - Add `AGORA_APP_ID` with your App ID
   - Add `AGORA_APP_CERTIFICATE` with your Certificate
3. Click the **Run** button

Both the frontend (port 5000) and backend (port 8000) will start automatically!

### How It Works in Replit

- **Frontend** runs on port 5000 (publicly accessible)
- **Backend** runs on port 8000 (internal only)
- **Vite proxy** automatically forwards `/rtc/*` requests from frontend to backend
- Single external URL serves the entire application

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AGORA_APP_ID` | Your Agora Application ID | ✅ Yes |
| `AGORA_APP_CERTIFICATE` | Your Agora App Certificate | ✅ Yes |

### Adding Secrets in Replit

1. Click **Secrets** (🔒) in the left sidebar
2. Click **+ New Secret**
3. Add name: `AGORA_APP_ID`, value: `your_app_id`
4. Click **Add Secret**
5. Repeat for `AGORA_APP_CERTIFICATE`

---

## 🔧 Troubleshooting

### Backend Not Working Locally

**Problem:** "Join Stream" button does nothing, console shows network errors.

**Solution:** Make sure both servers are running:
```bash
# Check if backend is running
curl http://127.0.0.1:8000/health

# Expected response:
# {"status":"ok","message":"Agora token server is running"}
```

If not running, start the backend:
```bash
npm run server
```

### Port Already in Use

**Problem:** Error: `EADDRINUSE: address already in use :::5000`

**Solution:** Kill the process using the port:
```bash
# Mac/Linux
lsof -ti:5000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Vite Proxy Not Working

**Problem:** Requests to `/rtc/*` fail with 404 or connection errors.

**Solutions:**
1. Make sure you're running `npm run dev` (proxy only works in dev mode)
2. Verify backend is running on port 8000
3. Check `vite.config.js` has proxy configured correctly
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Environment Variables Not Loading

**Problem:** "Server configuration error: Missing Agora credentials"

**Solutions:**
- **Replit:** Use Secrets (not `.env` file)
- **Local:** Create `.env` file in root directory
- Restart both servers after adding variables

### IPv6/IPv4 Issues on Mac

**Problem:** Proxy works in Replit but not locally on Mac.

**Solution:** The config already uses `127.0.0.1` instead of `localhost` to force IPv4.

---

## 🏗 Architecture

### File Structure

```
goblinmode/
├── server.js                    # Express backend (Agora token server)
├── vite.config.js              # Vite config with proxy setup
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (local only)
│
├── index.html                  # Landing page
├── logIn.html                  # Login page
├── createAcc.html              # Account creation
├── home.html                   # User home page
├── groupHome.html              # Campaign/group page
├── video.html                  # Video call interface
├── faq.html                    # FAQ page
│
├── firebaseManager.js          # Firebase auth & database
├── firebaseDnDFlavor.js        # D&D data management
├── videoManager.js             # Agora video call logic
├── fileManager.js              # Firebase storage
│
└── groupHomeDisplays/
    ├── inventory.jsx           # Inventory management UI
    └── spellbook.jsx           # Spellbook UI
```

### Request Flow

```
User clicks "Join Stream"
       ↓
Frontend (port 5000): videoManager.js requests token
       ↓
Vite Proxy: Forwards /rtc/* to http://127.0.0.1:8000
       ↓
Backend (port 8000): server.js generates Agora token
       ↓
Returns token to frontend
       ↓
Agora SDK joins video channel with token
       ↓
Video call established
```

### Backend API

**Token Generation Endpoint:**
```
GET /rtc/:channelName/:role/uid/:uid/?expiry=<seconds>
```

**Parameters:**
- `channelName` - Name of the video channel (campaign ID)
- `role` - User role: `1` = Broadcaster, `2` = Subscriber
- `uid` - User ID (0 for auto-assign)
- `expiry` - Token expiration time in seconds (default: 3600)

**Response:**
```json
{
  "rtcToken": "007eJxT...",
  "appId": "559b352c..."
}
```

**Health Check:**
```
GET /health
```

---

## 📝 Development Notes

### Vite Proxy Configuration

The Vite dev server is configured to proxy `/rtc/*` requests to the backend:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
    proxy: {
      '/rtc': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### Why Two Servers?

- **Frontend (Vite):** Serves HTML, CSS, JS and handles hot module replacement
- **Backend (Express):** Generates secure Agora tokens using your App Certificate
- **Security:** App Certificate never exposed to client-side code

### Production Build

```bash
npm run build
```

Builds the frontend to `dist/` folder. Note: In production, you'll need to configure your web server to proxy `/rtc/*` requests to your backend server.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 🎮 Happy Gaming!

May your rolls be high and your connections stable! 🎲✨
