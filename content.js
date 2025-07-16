// Function to fill form and click button
function fillFormAndSubmit(data) {
    // Find username and password fields (common selectors)
    const usernameField = document.querySelector('input[name="username"]');
    const passwordField = document.querySelector('input[name="password"]');
    
    // Find specific buttons by ID first, then fall back to general selectors
    let buttons = [
        document.querySelector('#in'),  // Clock IN button
        document.querySelector('#out')  // Clock OUT button
    ].filter(btn => btn); // Remove null values
    
    // If specific buttons not found, fall back to general button search
    if (buttons.length === 0) {
        buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
    }
    
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
    
    // Handle hidden fields
    const inoutField = document.querySelector('input[name="inout"]');
    if (inoutField) {
        inoutField.value = data.buttonIndex === 0 ? 'in' : 'out';
    }
    
    // If buttonIndex is provided and valid, click the specified button
    if (data.buttonIndex !== undefined && buttons[data.buttonIndex]) {
        setTimeout(() => {
            // Set the inout value based on which button is clicked
            if (inoutField) {
                inoutField.value = buttons[data.buttonIndex].id === 'in' ? 'in' : 'out';
            }
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