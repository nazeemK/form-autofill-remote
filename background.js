// Listen for messages from external webpage (local)
chrome.runtime.onMessageExternal.addListener(
    async (request, sender, sendResponse) => {
        console.log('Background script received external message:', request);
        if (request.action === 'fillForm') {
            try {
                // Get the active tab
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                console.log('Found active tab:', tab);
                
                // Send message to content script
                const response = await chrome.tabs.sendMessage(tab.id, {
                    action: 'fillForm',
                    data: {
                        username: request.username,
                        password: request.password,
                        buttonIndex: request.buttonIndex
                    }
                });
                console.log('Sent message to content script, response:', response);
                
                sendResponse({ status: 'success', response });
            } catch (error) {
                console.error('Error in background script:', error);
                sendResponse({ status: 'error', error: error.message });
            }
        }
        return true;
    }
);

// Remote triggering system
let remoteConfig = {
    deviceId: null,
    binId: '687789ef6063391d31aeb982', // Fixed bin ID
    serverUrl: 'https://api.jsonbin.io/v3/b', // Free JSON storage service
    pollingInterval: 3000, // Check every 3 seconds
    isPolling: false,
    apiKey: '$2a$10$bPb7m5nuFs4M2Ii9h2nbg.ohAafweMMAukD.UStpOTUKx81tZMJ0G'
};

// Generate unique device ID on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['deviceId'], (result) => {
        if (!result.deviceId) {
            const deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
            remoteConfig.deviceId = deviceId;
            chrome.storage.local.set({ deviceId });
        } else {
            remoteConfig.deviceId = result.deviceId;
        }
        console.log('Device ID:', remoteConfig.deviceId);
        startRemotePolling();
    });
});

// Start polling for remote commands
async function startRemotePolling() {
    if (remoteConfig.isPolling) return;
    
    remoteConfig.isPolling = true;
    console.log('Started remote polling for device:', remoteConfig.deviceId);
    
    const pollForCommands = async () => {
        try {
            // Check for pending commands
            const response = await fetch(`${remoteConfig.serverUrl}/${remoteConfig.binId}`, {
                headers: {
                    'X-Master-Key': remoteConfig.apiKey
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.record && data.record.command && data.record.timestamp) {
                    const commandAge = Date.now() - data.record.timestamp;
                    
                    // Only process commands less than 30 seconds old
                    if (commandAge < 30000) {
                        await processRemoteCommand(data.record.command);
                        // Clear the command after processing
                        await clearRemoteCommand();
                    }
                }
            }
        } catch (error) {
            console.log('Polling error:', error);
        }
        
        if (remoteConfig.isPolling) {
            setTimeout(pollForCommands, remoteConfig.pollingInterval);
        }
    };
    
    pollForCommands();
}

// Process remote command
async function processRemoteCommand(command) {
    console.log('Processing remote command:', command);
    if (command.action === 'fillForm') {
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            console.log('Found active tab for remote command:', tab);
            
            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, {
                action: 'fillForm',
                data: {
                    username: command.username,
                    password: command.password,
                    buttonIndex: command.buttonIndex
                }
            });
            
            console.log('Remote command executed successfully');
        } catch (error) {
            console.error('Remote command failed:', error);
        }
    }
}

// Clear remote command after processing
async function clearRemoteCommand() {
    try {
        await fetch(`${remoteConfig.serverUrl}/${remoteConfig.binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': remoteConfig.apiKey
            },
            body: JSON.stringify({
                deviceId: remoteConfig.deviceId,
                command: null,
                timestamp: null
            })
        });
    } catch (error) {
        console.log('Failed to clear command:', error);
    }
}

// Listen for tab activation to start polling
chrome.tabs.onActivated.addListener(() => {
    startRemotePolling();
});

// Listen for window focus to start polling
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        startRemotePolling();
    }
});

// Start polling when extension loads
chrome.storage.local.get(['deviceId'], (result) => {
    if (result.deviceId) {
        remoteConfig.deviceId = result.deviceId;
        startRemotePolling();
    }
}); 