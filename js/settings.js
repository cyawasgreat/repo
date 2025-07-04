// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4ilHYP1T-kdXbWPoHJHhD2aj0pNWmMec",
  authDomain: "carbon-services.firebaseapp.com",
  projectId: "carbon-services",
  storageBucket: "carbon-services.firebasestorage.app",
  messagingSenderId: "288385472070",
  appId: "1:288385472070:web:c4be3ff186e248fc645c47",
  measurementId: "G-Y2K1RQYE74"
};

// Initialize Firebase
let db;
let auth;
let userId = 'anonymous';

// Load Firebase SDK
async function loadFirebase() {
  try {
    // Load Firebase modules
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, doc, setDoc, getDoc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const { getAuth, signInAnonymously, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Sign in anonymously
    await signInAnonymously(auth);
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId = user.uid;
        loadSettingsFromFirebase();
      }
    });
    
    return { db, auth, doc, setDoc, getDoc, updateDoc };
  } catch (error) {
    console.error('Firebase loading error:', error);
    return null;
  }
}

// Settings object
let settings = {
  openMode: 'tab',
  alwaysOpenBlank: false,
  alwaysOpenBlob: false,
  panicKey: 'Escape',
  panicKeyType: 'preset',
  cloakerType: 'preset',
  cloakerPreset: 'google',
  cloakerCustomTitle: '',
  cloakerCustomIcon: '',
  cloakerCustomUrl: '',
  antiTeacher: false,
  enableBlur: false,
  enableSoundAlert: false,
  enableAutoHide: false,
  tabCloakerActive: false
};

// Auto-save timeout
let autoSaveTimeout;
let firebaseModules;

// Predefined cloaker options
const cloakerPresets = {
  google: {
    title: 'Google',
    icon: 'https://www.google.com/favicon.ico',
    url: 'https://www.google.com'
  },
  gmail: {
    title: 'Gmail',
    icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    url: 'https://mail.google.com'
  },
  youtube: {
    title: 'YouTube',
    icon: 'https://www.youtube.com/favicon.ico',
    url: 'https://www.youtube.com'
  },
  classroom: {
    title: 'Google Classroom',
    icon: 'https://ssl.gstatic.com/classroom/favicon.ico',
    url: 'https://classroom.google.com'
  },
  drive: {
    title: 'Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    url: 'https://drive.google.com'
  },
  docs: {
    title: 'Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    url: 'https://docs.google.com'
  }
};

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', async function() {
  // Load Firebase
  firebaseModules = await loadFirebase();
  
  // Load settings from localStorage as fallback
  loadSettings();
  
  // Initialize UI
  initializeUI();
  
  // Set up event listeners
  setupEventListeners();
  
  // Update status display
  updateStatusDisplay();
  
  // Setup panic key listener
  setupPanicKeyListener();
  
  // Setup anti-teacher features
  setupAntiTeacherFeatures();
  
  console.log('Settings page initialized');
});

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem('carbonSettings');
  if (savedSettings) {
    try {
      settings = { ...settings, ...JSON.parse(savedSettings) };
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  }
}

// Load settings from Firebase
async function loadSettingsFromFirebase() {
  if (!firebaseModules || !userId) return;
  
  try {
    const { doc, getDoc } = firebaseModules;
    const docRef = doc(db, 'userSettings', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const firebaseSettings = docSnap.data();
      settings = { ...settings, ...firebaseSettings };
      localStorage.setItem('carbonSettings', JSON.stringify(settings));
      updateUIFromSettings();
      updateStatusDisplay();
      console.log('Settings loaded from Firebase');
    }
  } catch (error) {
    console.error('Error loading settings from Firebase:', error);
  }
}

// Save settings to localStorage and Firebase
async function saveSettings() {
  // Save to localStorage
  localStorage.setItem('carbonSettings', JSON.stringify(settings));
  
  // Save to Firebase
  if (firebaseModules && userId && userId !== 'anonymous') {
    try {
      const { doc, setDoc } = firebaseModules;
      const docRef = doc(db, 'userSettings', userId);
      await setDoc(docRef, settings, { merge: true });
      console.log('Settings saved to Firebase');
    } catch (error) {
      console.error('Error saving settings to Firebase:', error);
    }
  }
  
  updateStatusDisplay();
}

// Auto-save function with debouncing
function autoSave() {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    saveSettings();
    showNotification('Settings auto-saved', 'success');
  }, 5000); // 5 second delay
}

// Initialize UI elements
function initializeUI() {
  // Populate panic key presets
  const panicKeySelect = document.getElementById('panicKeyPreset');
  if (panicKeySelect) {
    for (let i = 65; i <= 90; i++) {
      const option = document.createElement('option');
      option.value = String.fromCharCode(i);
      option.textContent = String.fromCharCode(i);
      panicKeySelect.appendChild(option);
    }
    // Add special keys
    const specialKeys = ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
    specialKeys.forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      panicKeySelect.appendChild(option);
    });
  }
  
  // Populate cloaker presets
  const cloakerSelect = document.getElementById('cloakerPreset');
  if (cloakerSelect) {
    Object.keys(cloakerPresets).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = cloakerPresets[key].title;
      cloakerSelect.appendChild(option);
    });
  }
  
  // Update UI from settings
  updateUIFromSettings();
}

// Update UI elements from settings
function updateUIFromSettings() {
  // Open Mode buttons
  updateButtonState('openModeBlankBtn', settings.openMode === 'blank');
  updateButtonState('openModeBlobBtn', settings.openMode === 'blob');
  
  // Toggles
  updateToggle('alwaysOpenBlank', settings.alwaysOpenBlank);
  updateToggle('alwaysOpenBlob', settings.alwaysOpenBlob);
  updateToggle('antiTeacher', settings.antiTeacher);
  updateToggle('enableBlur', settings.enableBlur);
  updateToggle('enableSoundAlert', settings.enableSoundAlert);
  updateToggle('enableAutoHide', settings.enableAutoHide);
  
  // Panic key
  const panicKeyType = document.getElementById('panicKeyType');
  if (panicKeyType) panicKeyType.value = settings.panicKeyType;
  
  const panicKeyPreset = document.getElementById('panicKeyPreset');
  if (panicKeyPreset) panicKeyPreset.value = settings.panicKey;
  
  const panicKeyCustom = document.getElementById('panicKeyCustom');
  if (panicKeyCustom) panicKeyCustom.value = settings.panicKey;
  
  // Cloaker settings
  const cloakerType = document.getElementById('cloakerType');
  if (cloakerType) cloakerType.value = settings.cloakerType;
  
  const cloakerPreset = document.getElementById('cloakerPreset');
  if (cloakerPreset) cloakerPreset.value = settings.cloakerPreset;
  
  // Custom cloaker fields
  const customTitle = document.getElementById('cloakerCustomTitle');
  const customIcon = document.getElementById('cloakerCustomIcon');
  const customUrl = document.getElementById('cloakerCustomakeURLrl');
  
  if (customTitle) customTitle.value = settings.cloakerCustomTitle;
  if (customIcon) customIcon.value = settings.cloakerCustomIcon;
  if (customUrl) customUrl.value = settings.cloakerCustomUrl;
  
  // Update panic key display
  updatePanicKeyDisplay();
  
  // Show/hide elements based on settings
  togglePanicKeyFields();
  toggleCloakerFields();
  
  // Show anti-teacher active state
  updateAntiTeacherDisplay();
}

// Update button state
function updateButtonState(buttonId, isActive) {
  const button = document.getElementById(buttonId);
  if (button) {
    if (isActive) {
      button.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-indigo-500', 'text-black');
      button.classList.remove('bg-white/10', 'text-white/70', 'hover:bg-white/20');
    } else {
      button.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-indigo-500', 'text-black');
      button.classList.add('bg-white/10', 'text-white/70', 'hover:bg-white/20');
    }
  }
}

// Update toggle switch
function updateToggle(toggleId, isActive) {
  const toggle = document.getElementById(toggleId);
  const bg = document.getElementById(toggleId + 'Bg');
  const knob = document.getElementById(toggleId + 'Knob');
  
  if (toggle && bg && knob) {
    toggle.checked = isActive;
    if (isActive) {
      bg.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-indigo-500');
      bg.classList.remove('bg-gray-600');
      knob.style.transform = 'translateX(20px)';
    } else {
      bg.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-indigo-500');
      bg.classList.add('bg-gray-600');
      knob.style.transform = 'translateX(0px)';
    }
  }
}

// Setup event listeners
function setupEventListeners() {
  // Open Mode buttons
  const openModeBlankBtn = document.getElementById('openModeBlankBtn');
  const openModeBlobBtn = document.getElementById('openModeBlobBtn');
  
  if (openModeBlankBtn) {
    openModeBlankBtn.addEventListener('click', () => {
      settings.openMode = 'blank';
      updateButtonState('openModeBlankBtn', true);
      updateButtonState('openModeBlobBtn', false);
      autoSave();
    });
  }
  
  if (openModeBlobBtn) {
    openModeBlobBtn.addEventListener('click', () => {
      settings.openMode = 'blob';
      updateButtonState('openModeBlankBtn', false);
      updateButtonState('openModeBlobBtn', true);
      autoSave();
    });
  }
  
  // Test open mode button
  const testOpenModeBtn = document.getElementById('testOpenModeBtn');
  if (testOpenModeBtn) {
    testOpenModeBtn.addEventListener('click', () => {
      openURL('https://www.google.com', settings.openMode);
      showNotification(`Testing ${settings.openMode} mode`, 'info');
    });
  }
  
  // Toggle switches
  setupToggleListener('alwaysOpenBlank');
  setupToggleListener('alwaysOpenBlob');
  setupToggleListener('antiTeacher');
  setupToggleListener('enableBlur');
  setupToggleListener('enableSoundAlert');
  setupToggleListener('enableAutoHide');
  
  // Panic key settings
  const panicKeyType = document.getElementById('panicKeyType');
  if (panicKeyType) {
    panicKeyType.addEventListener('change', (e) => {
      settings.panicKeyType = e.target.value;
      togglePanicKeyFields();
      updatePanicKeyDisplay();
      autoSave();
    });
  }
  
  const panicKeyPreset = document.getElementById('panicKeyPreset');
  if (panicKeyPreset) {
    panicKeyPreset.addEventListener('change', (e) => {
      settings.panicKey = e.target.value;
      updatePanicKeyDisplay();
      autoSave();
    });
  }
  
  const panicKeyCustom = document.getElementById('panicKeyCustom');
  if (panicKeyCustom) {
    panicKeyCustom.addEventListener('input', (e) => {
      settings.panicKey = e.target.value.toUpperCase();
      updatePanicKeyDisplay();
      autoSave();
    });
  }
  
  // Test panic key button
  const testPanicKeyBtn = document.getElementById('testPanicKeyBtn');
  if (testPanicKeyBtn) {
    testPanicKeyBtn.addEventListener('click', () => {
      triggerPanicMode();
      showNotification('Panic mode activated!', 'info');
    });
  }
  
  // Cloaker settings
  const cloakerType = document.getElementById('cloakerType');
  if (cloakerType) {
    cloakerType.addEventListener('change', (e) => {
      settings.cloakerType = e.target.value;
      toggleCloakerFields();
      autoSave();
    });
  }
  
  const cloakerPreset = document.getElementById('cloakerPreset');
  if (cloakerPreset) {
    cloakerPreset.addEventListener('change', (e) => {
      settings.cloakerPreset = e.target.value;
      autoSave();
    });
  }
  
  // Custom cloaker fields
  const customTitle = document.getElementById('cloakerCustomTitle');
  const customIcon = document.getElementById('cloakerCustomIcon');
  const customUrl = document.getElementById('cloakerCustomakeURLrl');
  
  if (customTitle) {
    customTitle.addEventListener('input', (e) => {
      settings.cloakerCustomTitle = e.target.value;
      autoSave();
    });
  }
  
  if (customIcon) {
    customIcon.addEventListener('input', (e) => {
      settings.cloakerCustomIcon = e.target.value;
      autoSave();
    });
  }
  
  if (customUrl) {
    customUrl.addEventListener('input', (e) => {
      settings.cloakerCustomUrl = e.target.value;
      autoSave();
    });
  }
  
  // Cloaker buttons
  const applyCloakerBtn = document.getElementById('applyCloakerBtn');
  if (applyCloakerBtn) {
    applyCloakerBtn.addEventListener('click', applyCloaker);
  }
  
  const removeCloakerBtn = document.getElementById('removeCloakerBtn');
  if (removeCloakerBtn) {
    removeCloakerBtn.addEventListener('click', removeCloaker);
  }
}

// Setup toggle listener helper
function setupToggleListener(toggleId) {
  const toggleBg = document.getElementById(toggleId + 'Bg');
  if (toggleBg) {
    toggleBg.addEventListener('click', () => {
      settings[toggleId] = !settings[toggleId];
      updateToggle(toggleId, settings[toggleId]);
      
      // Special handling for anti-teacher mode
      if (toggleId === 'antiTeacher') {
        updateAntiTeacherDisplay();
      }
      
      autoSave();
    });
  }
}

// Toggle panic key fields visibility
function togglePanicKeyFields() {
  const panicKeyPreset = document.getElementById('panicKeyPreset');
  const panicKeyCustom = document.getElementById('panicKeyCustom');
  
  if (settings.panicKeyType === 'custom') {
    if (panicKeyPreset) panicKeyPreset.style.display = 'none';
    if (panicKeyCustom) panicKeyCustom.style.display = 'block';
  } else {
    if (panicKeyPreset) panicKeyPreset.style.display = 'block';
    if (panicKeyCustom) panicKeyCustom.style.display = 'none';
  }
}

// Toggle cloaker fields visibility
function toggleCloakerFields() {
  const cloakerPreset = document.getElementById('cloakerPreset');
  const cloakerCustomFields = document.getElementById('cloakerCustomFields');
  
  if (settings.cloakerType === 'custom') {
    if (cloakerPreset) cloakerPreset.style.display = 'none';
    if (cloakerCustomFields) cloakerCustomFields.style.display = 'grid';
  } else {
    if (cloakerPreset) cloakerPreset.style.display = 'block';
    if (cloakerCustomFields) cloakerCustomFields.style.display = 'none';
  }
}

// Update panic key display
function updatePanicKeyDisplay() {
  const displays = document.querySelectorAll('#panicKeyDisplay, #panicKeyDisplay2');
  displays.forEach(display => {
    if (display) display.textContent = settings.panicKey;
  });
}

// Update anti-teacher display
function updateAntiTeacherDisplay() {
  const antiTeacherActive = document.getElementById('antiTeacherActive');
  if (antiTeacherActive) {
    antiTeacherActive.style.display = settings.antiTeacher ? 'block' : 'none';
  }
}

// Apply cloaker
function applyCloaker() {
  let title, icon, url;
  
  if (settings.cloakerType === 'preset') {
    const preset = cloakerPresets[settings.cloakerPreset];
    if (preset) {
      title = preset.title;
      icon = preset.icon;
      url = preset.url;
    }
  } else {
    title = settings.cloakerCustomTitle;
    icon = settings.cloakerCustomIcon;
    url = settings.cloakerCustomUrl;
  }
  
  if (title || icon) {
    cloakTab(title, icon);
    settings.tabCloakerActive = true;
    showNotification('Tab cloaker applied', 'success');
    autoSave();
  } else {
    showNotification('Please enter cloaker details', 'error');
  }
}

// Remove cloaker
function removeCloaker() {
  removeCloaking();
  settings.tabCloakerActive = false;
  showNotification('Tab cloaker removed', 'success');
  autoSave();
}

// Setup panic key listener
function setupPanicKeyListener() {
  document.addEventListener('keydown', (e) => {
    if (e.key === settings.panicKey || e.code === settings.panicKey) {
      e.preventDefault();
      triggerPanicMode();
    }
  });
}

// Trigger panic mode
function triggerPanicMode() {
  if (settings.antiTeacher) {
    toggleAntiTeacherMode();
  } else {
    // Default panic: redirect to Google
    window.location.href = 'https://www.google.com';
  }
}

// Setup anti-teacher features
function setupAntiTeacherFeatures() {
  if (settings.enableBlur) {
    setupBlurOnUnfocus();
  }
  
  if (settings.enableSoundAlert) {
    setupSoundAlert();
  }
  
  if (settings.enableAutoHide) {
    setupAutoHide();
  }
}

// Setup blur on unfocus
function setupBlurOnUnfocus() {
  let isPageVisible = true;
  
  document.addEventListener('visibilitychange', () => {
    if (settings.enableBlur) {
      if (document.hidden && isPageVisible) {
        document.body.style.filter = 'blur(5px)';
        isPageVisible = false;
      } else if (!document.hidden && !isPageVisible) {
        document.body.style.filter = 'none';
        isPageVisible = true;
      }
    }
  });
}

// Setup sound alert
function setupSoundAlert() {
  let audioContext;
  
  document.addEventListener('visibilitychange', () => {
    if (settings.enableSoundAlert && document.hidden) {
      try {
        if (!audioContext) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (e) {
        console.error('Sound alert error:', e);
      }
    }
  });
}

// Setup auto-hide
function setupAutoHide() {
  let inactivityTimer;
  let overlay;
  
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    if (settings.enableAutoHide) {
      inactivityTimer = setTimeout(() => {
        showHideOverlay();
      }, 300000); // 5 minutes
    }
  };
  
  const showHideOverlay = () => {
    overlay = document.getElementById('hideElementsOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  };
  
  const hideOverlay = () => {
    if (overlay) {
      overlay.style.display = 'none';
    }
    resetTimer();
  };
  
  // Reset timer on activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });
  
  // Hide overlay on click
  const overlay_el = document.getElementById('hideElementsOverlay');
  if (overlay_el) {
    overlay_el.addEventListener('click', hideOverlay);
  }
  
  resetTimer();
}

// Toggle anti-teacher mode
function toggleAntiTeacherMode() {
  const overlay = document.getElementById('hideElementsOverlay');
  if (overlay) {
    if (overlay.style.display === 'flex') {
      overlay.style.display = 'none';
    } else {
      overlay.style.display = 'flex';
    }
  }
}

// Update status display
function updateStatusDisplay() {
  const statusOpenMode = document.getElementById('statusOpenMode');
  const statusPanicKey = document.getElementById('statusPanicKey');
  const statusCloaker = document.getElementById('statusCloaker');
  const statusAntiTeacher = document.getElementById('statusAntiTeacher');
  
  if (statusOpenMode) {
    statusOpenMode.textContent = settings.openMode.charAt(0).toUpperCase() + settings.openMode.slice(1);
  }
  
  if (statusPanicKey) {
    statusPanicKey.textContent = settings.panicKey;
  }
  
  if (statusCloaker) {
    statusCloaker.textContent = settings.tabCloakerActive ? 'Active' : 'Inactive';
  }
  
  if (statusAntiTeacher) {
    statusAntiTeacher.textContent = settings.antiTeacher ? 'Enabled' : 'Disabled';
    statusAntiTeacher.className = `font-bold ${settings.antiTeacher ? 'text-green-400' : 'text-red-400'}`;
  }
}

// Manual save function (can be called externally)
window.saveSettingsManually = function() {
  saveSettings();
  showNotification('Settings saved manually', 'success');
};

// Export settings function
window.exportSettings = function() {
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'carbon_settings.json';
  link.click();
  URL.revokeObjectURL(url);
};

// Import settings function
window.importSettings = function(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedSettings = JSON.parse(e.target.result);
      settings = { ...settings, ...importedSettings };
      updateUIFromSettings();
      saveSettings();
      showNotification('Settings imported successfully', 'success');
    } catch (error) {
      showNotification('Error importing settings', 'error');
      console.error('Import error:', error);
    }
  };
  reader.readAsText(file);
};