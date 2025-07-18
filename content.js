// Function to fill form and click button
function fillFormAndSubmit(data) {
    console.log('Content script received data:', data);
    
    // Find username and password fields (common selectors)
    const usernameField = document.querySelector('input[name="username"]');
    const passwordField = document.querySelector('input[name="password"]');
    
    console.log('Found form fields:', {
        username: usernameField ? 'Found' : 'Not found',
        password: passwordField ? 'Found' : 'Not found'
    });
    
    // Find specific buttons by ID first, then fall back to general selectors
    let buttons = [
        document.querySelector('#in'),  // Clock IN button
        document.querySelector('#out')  // Clock OUT button
    ].filter(btn => btn); // Remove null values
    
    console.log('Found buttons by ID:', buttons.length);
    
    // If specific buttons not found, fall back to general button search
    if (buttons.length === 0) {
        buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
        console.log('Found buttons by general selector:', buttons.length);
    }
    
    if (!usernameField || !passwordField || buttons.length === 0) {
        chrome.runtime.sendMessage({
            action: 'formSubmitResult',
            status: 'error',
            message: 'Required form elements not found'
        });
        return;
    }
    
    // Check for existing error message
    const existingError = document.querySelector('#mymsg');
    if (existingError && existingError.textContent.trim()) {
        chrome.runtime.sendMessage({
            action: 'formSubmitResult',
            status: 'error',
            message: existingError.textContent.trim()
        });
        return;
    }
    
    if (usernameField && data.username) {
        usernameField.value = data.username;
        // Trigger input event to simulate real typing
        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Username field filled');
    }
    
    if (passwordField && data.password) {
        passwordField.value = data.password;
        // Trigger input event to simulate real typing
        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('Password field filled');
    }
    
    // Handle hidden fields
    const inoutField = document.querySelector('input[name="inout"]');
    if (inoutField) {
        inoutField.value = data.buttonIndex === 0 ? 'in' : 'out';
        console.log('Set inout field to:', inoutField.value);
    }
    
    // If buttonIndex is provided and valid, click the specified button
    if (data.buttonIndex !== undefined && buttons[data.buttonIndex]) {
        console.log('Will click button:', data.buttonIndex);
        setTimeout(() => {
            // Set the inout value based on which button is clicked
            if (inoutField) {
                inoutField.value = buttons[data.buttonIndex].id === 'in' ? 'in' : 'out';
                console.log('Updated inout field before click:', inoutField.value);
            }
            
            // Log button details before clicking
            console.log('Clicking button:', {
                id: buttons[data.buttonIndex].id,
                type: buttons[data.buttonIndex].type,
                value: buttons[data.buttonIndex].value
            });
            
            // Set up form submission monitoring
            const form = document.querySelector('form');
            if (form) {
                // Monitor for error messages
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            const errorMsg = document.querySelector('#mymsg');
                            if (errorMsg && errorMsg.textContent.trim()) {
                                chrome.runtime.sendMessage({
                                    action: 'formSubmitResult',
                                    status: 'error',
                                    message: errorMsg.textContent.trim()
                                });
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                const originalSubmit = form.submit;
                form.submit = function() {
                    chrome.runtime.sendMessage({
                        action: 'formSubmitResult',
                        status: 'success',
                        message: `Successfully ${data.buttonIndex === 0 ? 'clocked in' : 'clocked out'}`
                    });
                    originalSubmit.apply(this);
                };
                
                form.addEventListener('submit', function(e) {
                    chrome.runtime.sendMessage({
                        action: 'formSubmitResult',
                        status: 'success',
                        message: `Successfully ${data.buttonIndex === 0 ? 'clocked in' : 'clocked out'}`
                    });
                });
            }
            
            buttons[data.buttonIndex].click();
            console.log('Button clicked');
            
            // Set a timeout to check for error messages
            setTimeout(() => {
                const errorMsg = document.querySelector('#mymsg');
                if (errorMsg && errorMsg.textContent.trim()) {
                    chrome.runtime.sendMessage({
                        action: 'formSubmitResult',
                        status: 'error',
                        message: errorMsg.textContent.trim()
                    });
                } else if (document.querySelector('form')) {
                    chrome.runtime.sendMessage({
                        action: 'formSubmitResult',
                        status: 'error',
                        message: 'Form still present after submission - possible error'
                    });
                }
            }, 2000);
        }, 500); // Small delay to ensure form is filled before clicking
    } else {
        console.log('No valid button found to click. ButtonIndex:', data.buttonIndex, 'Available buttons:', buttons.length);
        chrome.runtime.sendMessage({
            action: 'formSubmitResult',
            status: 'error',
            message: 'No valid button found to click'
        });
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    if (request.action === 'fillForm') {
        fillFormAndSubmit(request.data);
        sendResponse({ status: 'received' });
    }
    return true;
}); 