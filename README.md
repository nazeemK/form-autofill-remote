# Form Auto-Fill Chrome Extension

A Chrome extension that automatically fills username and password fields and clicks buttons on web pages. The extension can be triggered externally from a webpage or manually through the extension popup.

## Features

- Auto-fill username and password fields
- Click one of two buttons (configurable)
- External trigger via webpage
- Manual trigger via extension popup
- Works on any website

## Installation

1. **Enable Developer Mode in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

2. **Load the Extension:**
   - Click "Load unpacked"
   - Select the folder containing these extension files
   - The extension will be installed and you'll see its icon in the toolbar

3. **Get the Extension ID:**
   - After installation, click on the extension icon in the toolbar
   - Copy the Extension ID displayed in the popup (you'll need this for external triggers)

## Usage

### Method 1: External Trigger (Webpage)

1. Open `trigger.html` in your browser
2. Replace `YOUR_EXTENSION_ID_HERE` in the trigger.html file with your actual extension ID
3. Fill in the username, password, and select which button to click
4. Navigate to the webpage where you want to auto-fill the form
5. Go back to the trigger page and click "Trigger Auto-Fill"

### Method 2: Manual Trigger (Extension Popup)

1. Navigate to the webpage with the form you want to fill
2. Click the extension icon in the Chrome toolbar
3. Enter the username and password in the popup
4. Select which button to click (First Button or Second Button)
5. Click "Fill Current Page"

## How It Works

The extension uses three main components:

1. **Content Script (`content.js`)**: Runs on all web pages and handles form filling and button clicking
2. **Background Script (`background.js`)**: Handles external messages and coordinates between components
3. **Popup (`popup.html` + `popup.js`)**: Provides a manual interface for triggering the auto-fill

## Field Detection

The extension automatically detects form fields using common selectors:

- **Username fields**: `input[type="text"]`, `input[type="email"]`, `input[name="username"]`
- **Password fields**: `input[type="password"]`
- **Buttons**: `button`, `input[type="submit"]`, `input[type="button"]`

## Security Notes

- This extension has broad permissions to work on all websites
- Be cautious about what credentials you enter
- Only install from trusted sources
- The extension stores no data permanently

## Troubleshooting

**Extension not working:**
- Make sure Developer mode is enabled
- Check that the extension is enabled in chrome://extensions/
- Verify the Extension ID is correct in trigger.html

**Form not filling:**
- Check that the page has detectable username/password fields
- Some websites may use non-standard field types
- Try refreshing the page and trying again

**External trigger not working:**
- Ensure the Extension ID in trigger.html matches your installed extension
- Check the browser console for error messages
- Make sure you're on the correct tab when triggering

## File Structure

```
chrome-extension/
├── manifest.json       # Extension configuration
├── content.js         # Content script for form manipulation
├── background.js      # Background script for message handling
├── popup.html         # Extension popup interface
├── popup.js          # Popup functionality
├── trigger.html      # External trigger webpage
└── README.md         # This file
```

## Permissions Explained

- `activeTab`: Access to the currently active tab for form filling
- `scripting`: Ability to inject and execute scripts
- `storage`: For potential future credential storage features
- `host_permissions`: Access to all websites for universal form filling 