// Display the device ID when popup loads
document.addEventListener('DOMContentLoaded', function() {
    // Get and display device ID
    chrome.storage.local.get(['deviceId'], (result) => {
        if (result.deviceId) {
            document.getElementById('deviceId').textContent = result.deviceId;
        } else {
            // Generate device ID if not exists
            const deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
            chrome.storage.local.set({ deviceId });
            document.getElementById('deviceId').textContent = deviceId;
        }
    });
});

// Copy device ID to clipboard
function copyDeviceId() {
    const deviceIdElement = document.getElementById('deviceId');
    const deviceId = deviceIdElement.textContent;
    
    navigator.clipboard.writeText(deviceId).then(() => {
        // Show success feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#007bff';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = deviceId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showStatus('success', 'Device ID copied to clipboard!');
    });
}

// Handle local form submission
document.getElementById('fillForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const buttonIndex = parseInt(document.getElementById('buttonIndex').value);
    
    const statusDiv = document.getElementById('status');
    statusDiv.style.display = 'block';
    
    try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Send message to content script
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'fillForm',
            data: {
                username: username,
                password: password,
                buttonIndex: buttonIndex
            }
        });
        
        showStatus('success', 'Form filled successfully!');
        
        // Close popup after success
        setTimeout(() => {
            window.close();
        }, 1000);
        
    } catch (error) {
        showStatus('error', 'Error: ' + error.message);
    }
});

function showStatus(type, message) {
    const statusDiv = document.getElementById('status');
    statusDiv.style.display = 'block';
    statusDiv.className = `status ${type}`;
    statusDiv.textContent = message;
} 