# GoblinMode - D&D Flavored Video Call Website

## Overview
GoblinMode is a video call website with Dungeons & Dragons theming that allows users to create accounts, join campaigns/groups, manage character inventory and spellbooks, and participate in video calls with other players.

**Current State**: Fully configured for Replit environment with local token server and frontend.

## Recent Changes
- **2025-11-06**: Converted React components to vanilla JavaScript
  - Converted inventory.jsx and spellbook.jsx to pure vanilla JS (inventory.js, spellbook.js)
  - Implemented reactive state management pattern to preserve dynamic behavior
  - Granular DOM updates preserve input focus while typing
  - Checkbox state syncs correctly between UI and Firebase
  - Optimized Firebase writes to only update specific items being added/changed
  - Removed all React dependencies (React, ReactDOM, Vite React plugin, Babel)
  - Updated HTML files to reference .js files instead of .jsx
  - **Reason**: React components weren't working in production deployment when mixed with vanilla JS

- **2025-11-06**: Initial Replit setup and local backend implementation
  - Configured Vite to bind to 0.0.0.0:5000 for Replit proxy compatibility
  - Created Express backend server for Agora token generation (port 8000)
  - Replaced Railway/CORS-anywhere dependency with local token server
  - Implemented secure Agora credential storage via environment variables
  - Configured Vite proxy to forward `/rtc/*` requests to backend server
  - Simplified URL handling - frontend uses same origin, Vite handles routing
  - Updated .gitignore to exclude Replit config files
  - Created workflows for both frontend and backend servers
  - Fixed IPv4/IPv6 localhost resolution issue for local development
  - Created comprehensive README.md with setup instructions
  - Added setup.sh script for automated local environment setup
  - Added `npm start` script for quick local development

## Project Architecture

### Technology Stack
- **Frontend**: Vite + vanilla JavaScript/HTML (React removed for production compatibility)
- **Backend**: Express.js server for Agora token generation
- **Video Calling**: Agora RTC SDK
- **Backend Services**: 
  - Firebase Authentication
  - Firebase Realtime Database
  - Firebase Storage
- **Build Tool**: Vite 5.x
- **Package Manager**: npm

### Key Files & Structure
- `index.html` - Landing page with login/create account options
- `logIn.html` - User login page
- `createAcc.html` - Account creation page
- `home.html` - User home page
- `groupHome.html` - Group/campaign home page
- `video.html` - Video call interface
- `faq.html` - FAQ page
- `server.js` - Express backend for Agora token generation

### JavaScript Components
- `mainInventory.js` - Entry point for inventory component
- `mainSpellBook.js` - Entry point for spellbook component
- `groupHomeDisplays/inventory.js` - Reactive inventory management UI with state management
- `groupHomeDisplays/spellbook.js` - Reactive spellbook management UI with state management

### Core Modules
- `firebaseManager.js` - Firebase auth and database operations
- `firebaseDnDFlavor.js` - D&D-specific data management (inventory, spells)
- `videoManager.js` - Agora video call setup and management
- `fileManager.js` - Firebase storage for file uploads
- `server.js` - Token generation endpoint for Agora RTC
- `vite.config.js` - Vite configuration with proxy for backend requests

### External Services
- **Agora**: Video SDK and channel hosting
- **Firebase**: "goblin-mode" project (Realtime Database, Authentication, Storage)

### Environment Variables
The following secrets are configured:
- `AGORA_APP_ID` - Agora application ID
- `AGORA_APP_CERTIFICATE` - Agora app certificate (for secure token generation)

## Development Notes

### Running the App
Two workflows run automatically:
1. **Frontend** (`npm run dev`): Vite server on port 5000 (publicly exposed)
2. **Backend** (`npm run server`): Express token server on port 8000 (internal only)

The frontend is configured to bind to 0.0.0.0 for external accessibility in Replit.
The backend runs internally and is accessed through Vite's proxy.

### Agora Token Server
- Backend endpoint: `/rtc/:channelName/:role/uid/:uid/?expiry=<seconds>`
- Role: 1 = Broadcaster, 2 = Subscriber
- Default expiry: 3600 seconds (1 hour)
- Frontend accesses backend through Vite proxy (configured in `vite.config.js`)
- All `/rtc/*` requests are automatically forwarded to `http://localhost:8000`

### Important Considerations
1. **No external dependencies**: No Railway or CORS-anywhere needed
2. **Secure credentials**: Agora secrets stored in Replit environment variables
3. **Vite proxy**: Single external port (5000) serves both frontend and backend requests
4. **Firebase**: Uses hardcoded Firebase config (already in code)
5. **Internal routing**: Backend port 8000 is not exposed externally - all requests go through Vite proxy

### Future Improvements
- Add token expiration refresh mechanism for long video calls
- Implement error handling UI for token generation failures
- Add health check monitoring for backend server
