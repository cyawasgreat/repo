# CARBON Settings Features Documentation

## Overview
The settings.html page now includes comprehensive functionality with Firebase synchronization and auto-save capabilities. All settings are automatically saved 5 seconds after any change and synchronized with Firebase for cross-device persistence.

## Features Implemented

### 🔧 Core Functionality
- **Auto-save**: All changes are automatically saved after 5 seconds
- **Firebase Sync**: Settings synchronize across devices using Firebase Firestore
- **LocalStorage Fallback**: Settings work offline with localStorage backup
- **Real-time Status Display**: Current settings shown in status card

### 🪟 Open Mode
- **About:blank Mode**: Opens URLs in about:blank windows
- **Blob Mode**: Creates blob URLs for enhanced privacy
- **Test Function**: Test button to verify current open mode
- **Always Open Options**: Force all links to use selected mode

### 🚨 Panic Key
- **Customizable Key**: Choose from A-Z keys or special function keys
- **Custom Key Support**: Enter any custom key combination
- **Instant Activation**: Press configured key to trigger panic mode
- **Real-time Display**: Shows current panic key in UI

### 🎭 Tab Cloaker
- **Preset Sites**: Quick selection from popular sites (Google, Gmail, YouTube, etc.)
- **Custom Cloaking**: Set custom title, favicon, and URL
- **Apply/Remove**: Easy toggle for cloaker functionality
- **Live Preview**: See changes immediately

### 🛡️ Anti-Teacher Prevention
- **Toggle Mode**: Enable/disable anti-teacher features
- **Panic Integration**: Works with panic key for quick hiding
- **Visual Feedback**: Shows active status when enabled
- **Overlay System**: Full-screen loading overlay for hiding content

### ⚡ Additional Features

#### 🔍 Blur on Unfocus
- Automatically blurs page content when tab loses focus
- Prevents content visibility when switching tabs
- Re-enables when tab regains focus

#### 🔊 Sound Alert
- Plays audio alert when switching away from tab
- Uses Web Audio API for reliable sound generation
- Helps detect when someone is looking at your screen

#### ⏰ Auto-Hide After Inactivity
- Automatically hides content after 5 minutes of inactivity
- Tracks mouse movement, clicks, keypress, and scroll events
- Shows loading overlay until user interacts again
- Click anywhere to restore normal view

## Technical Implementation

### Firebase Configuration
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC4ilHYP1T-kdXbWPoHJHhD2aj0pNWmMec",
  authDomain: "carbon-services.firebaseapp.com",
  projectId: "carbon-services",
  storageBucket: "carbon-services.firebasestorage.app",
  messagingSenderId: "288385472070",
  appId: "1:288385472070:web:c4be3ff186e248fc645c47",
  measurementId: "G-Y2K1RQYE74"
};
```

### Auto-Save System
- 5-second debounced auto-save
- Simultaneous localStorage and Firebase storage
- Anonymous authentication for Firebase
- Error handling for offline scenarios

### Event Listeners
- All UI elements have proper event listeners
- Real-time updates without page refresh
- Smooth animations and transitions
- Responsive design for mobile devices

## File Structure
```
/workspace/
├── settings.html          # Main settings page
├── js/
│   ├── settings.js        # Core settings functionality with Firebase
│   ├── actions.js         # Utility functions (openURL, cloakTab, etc.)
│   └── hamburger.js       # Mobile navigation functionality
└── SETTINGS_FEATURES.md   # This documentation
```

## Settings Object
All settings are stored in a comprehensive object:
```javascript
{
  openMode: 'tab|blank|blob',
  alwaysOpenBlank: boolean,
  alwaysOpenBlob: boolean,
  panicKey: string,
  panicKeyType: 'preset|custom',
  cloakerType: 'preset|custom',
  cloakerPreset: string,
  cloakerCustomTitle: string,
  cloakerCustomIcon: string,
  cloakerCustomUrl: string,
  antiTeacher: boolean,
  enableBlur: boolean,
  enableSoundAlert: boolean,
  enableAutoHide: boolean,
  tabCloakerActive: boolean
}
```

## Usage Instructions

1. **Open Settings**: Navigate to settings.html
2. **Configure Features**: Use toggles and dropdowns to set preferences
3. **Auto-Save**: Changes save automatically after 5 seconds
4. **Test Features**: Use test buttons to verify functionality
5. **Panic Mode**: Press configured panic key anytime for emergency hiding

## Browser Compatibility
- Modern browsers with ES6+ support
- Firebase v10.7.1 for cross-platform sync
- Web Audio API for sound alerts
- Visibility API for blur/focus detection

## Security Features
- Anonymous Firebase authentication
- No personal data collection
- Local storage encryption ready
- Privacy-focused design

All features are now fully functional with comprehensive error handling, user feedback, and seamless Firebase synchronization.