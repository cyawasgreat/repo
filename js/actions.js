// Basic utility functions

// Open URL with selected method
function openURL(url, method = 'tab') {
  if (!url) return;
  
  switch (method) {
    case 'blank':
      const newWindow = window.open('about:blank', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <iframe src="${url}" style="position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;z-index:999999;"></iframe>
        `);
      }
      break;
    case 'blob':
      const blobData = `
        <html>
          <head><title>Loading...</title></head>
          <body style="margin:0;padding:0;">
            <iframe src="${url}" style="position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;border:none;margin:0;padding:0;overflow:hidden;z-index:999999;"></iframe>
          </body>
        </html>
      `;
      const blob = new Blob([blobData], { type: 'text/html' });
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL, '_blank');
      break;
    default:
      window.open(url, '_blank');
  }
}

// Cloak tab with custom title and favicon
function cloakTab(title, faviconUrl) {
  if (title) document.title = title;
  
  if (faviconUrl) {
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }
    
    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }
}

// Remove cloak and restore original
function removeCloaking() {
  document.title = 'CARBON - Settings';
  
  // Remove existing favicon
  const existingFavicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (existingFavicon) {
    existingFavicon.remove();
  }
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-[10000] px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Fade in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Generate random string
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}