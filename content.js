// Function to fill form and click button
function fillFormAndSubmit(data) {
    // Find username and password fields (common selectors)
    const usernameField = document.querySelector('input[type="text"], input[type="email"], input[name="username"]');
    const passwordField = document.querySelector('input[type="password"]');
    
    // Find submit buttons (looking for two buttons as specified)
    const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
    
    if (usernameField && data.username) {
        usernameField.value = data.username;
        // Trigger input event to simulate real typing
        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    if (passwordField && data.password) {
        passwordField.value = data.password;
        // Trigger input event to simulate real typing
        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // If buttonIndex is provided and valid, click the specified button
    if (data.buttonIndex !== undefined && buttons[data.buttonIndex]) {
        setTimeout(() => {
            buttons[data.buttonIndex].click();
        }, 500); // Small delay to ensure form is filled before clicking
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillForm') {
        fillFormAndSubmit(request.data);
        sendResponse({ status: 'success' });
    }
    return true;
}); 