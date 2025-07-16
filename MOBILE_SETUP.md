# Mobile URL Triggering Setup Guide

## 🚀 Quick Setup

### Step 1: Install and Configure Extension
1. Load your extension in Chrome (chrome://extensions/ → Developer mode → Load unpacked)
2. Click on the extension popup to see your Extension ID
3. Copy the Extension ID (looks like: `abcdefghijklmnopqrstuvwxyz123456`)

### Step 2: Update Extension ID
1. Open `trigger.html`
2. Replace `YOUR_EXTENSION_ID_HERE` with your actual Extension ID:
   ```javascript
   const EXTENSION_ID = "abcdefghijklmnopqrstuvwxyz123456"; // Your actual ID
   ```

### Step 3: Host the Trigger Page
Upload `trigger.html` to any web hosting service:
- **GitHub Pages** (free): Create a repo, upload file, enable Pages
- **Netlify** (free): Drag and drop file to netlify.com
- **Vercel** (free): Connect GitHub repo or upload directly
- **Your own server**: Upload to any HTTP/HTTPS server

## 📱 Mobile Usage

### Method 1: URL Parameters (Recommended)
Create bookmarks or shortcuts with these URL formats:

**Manual trigger** (shows form, then click button):
```
https://yourdomain.com/trigger.html?username=myuser&password=mypass&buttonIndex=0
```

**Auto trigger** (immediately fills and submits):
```
https://yourdomain.com/trigger.html?username=myuser&password=mypass&buttonIndex=0&auto=true
```

### Method 2: Quick Buttons
1. Open `https://yourdomain.com/trigger.html`
2. Fill in the form manually
3. Use "Quick Fill" or "URL Trigger" buttons

### URL Parameters Reference
| Parameter | Description | Example |
|-----------|-------------|---------|
| `username` | Username to fill | `username=john@example.com` |
| `password` | Password to fill | `password=secretpass` |
| `buttonIndex` | Which button to click (0=first, 1=second) | `buttonIndex=1` |
| `auto` | Auto-trigger immediately | `auto=true` |

## 🔧 Mobile Workflow

### Option A: Bookmark Method
1. **Desktop Setup**: Create bookmarks with your trigger URLs
2. **Sync**: Enable Chrome sync to get bookmarks on mobile
3. **Mobile Use**:
   - Open target website in Chrome mobile
   - Open bookmark in new tab
   - Switch back to target site → auto-filled!

### Option B: QR Code Method
1. Generate QR codes for your trigger URLs using:
   - QR Code generators online
   - https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YOUR_URL
2. Scan QR code on mobile to open trigger URL

### Option C: Shared Link Method
1. Save trigger URLs in:
   - Notes app
   - Password manager
   - Messaging apps
2. Click link when needed

## 🛠️ Advanced Configuration

### Custom Button Targeting
The `buttonIndex` parameter targets buttons in this order:
- 0: First button/submit element found
- 1: Second button/submit element found
- etc.

To target specific buttons, inspect the page and count button elements.

### Security Considerations
- **Never** put real passwords in URLs you share
- Use environment variables or secure storage for sensitive data
- Consider using temporary/test credentials for setup

### Troubleshooting

**Extension not responding?**
- Verify Extension ID is correct
- Ensure extension is enabled
- Check `externally_connectable` is in manifest.json
- Reload extension after changes

**Auto-trigger not working?**
- Ensure `auto=true` is in URL
- Check target website allows form filling
- Try increasing delay in `trigger.html` (line with setTimeout)

**Mobile browser issues?**
- Use Chrome mobile (other browsers may not support extensions)
- Ensure both tabs are in same Chrome session
- Try refreshing both tabs

## 📝 Example URLs

**Gmail login:**
```
https://yourdomain.com/trigger.html?username=user@gmail.com&password=temppass&buttonIndex=0&auto=true
```

**Two-button form (click second button):**
```
https://yourdomain.com/trigger.html?username=testuser&password=testpass&buttonIndex=1&auto=true
```

**Manual review before submit:**
```
https://yourdomain.com/trigger.html?username=testuser&password=testpass&buttonIndex=0
```

## 🎯 Pro Tips

1. **Test first**: Always test with dummy credentials
2. **Multiple configs**: Create different URLs for different sites
3. **Bookmark organization**: Group by website in bookmark folders
4. **Backup**: Save important trigger URLs in multiple places
5. **Privacy**: Use private/incognito browsing for sensitive operations

## 🔒 Security Best Practices

- Use test/dummy credentials for initial setup
- Never share URLs containing real passwords
- Delete browser history after testing
- Consider using temporary passwords that you change after setup
- Use password managers for secure credential storage

Your extension is now ready for mobile triggering! 🎉 