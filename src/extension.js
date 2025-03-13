const vscode = require('vscode');

/**
 * Activate the extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('ColorShift Material Pro is now active!');

    // Register the command to toggle time-based shifting
    let toggleCommand = vscode.commands.registerCommand('colorshift.toggleTimeBasedShifting', function () {
        const config = vscode.workspace.getConfiguration('colorshift');
        const currentValue = config.get('enableTimeBasedShifting');
        
        config.update('enableTimeBasedShifting', !currentValue, true).then(() => {
            vscode.window.showInformationMessage(
                `Time-based color shifting is now ${!currentValue ? 'enabled' : 'disabled'}.`
            );
            
            if (!currentValue) {
                // If we're enabling it, apply the theme immediately
                applyThemeBasedOnTime();
            }
        });
    });

    context.subscriptions.push(toggleCommand);

    // Set up a timer to check the time every hour
    const ONE_HOUR = 60 * 60 * 1000;
    setInterval(applyThemeBasedOnTime, ONE_HOUR);
    
    // Apply theme on startup if enabled
    applyThemeBasedOnTime();
}

/**
 * Apply the appropriate theme based on the current time
 */
function applyThemeBasedOnTime() {
    const config = vscode.workspace.getConfiguration('colorshift');
    const isEnabled = config.get('enableTimeBasedShifting');
    
    if (!isEnabled) {
        return;
    }
    
    const currentHour = new Date().getHours();
    const morningStartHour = config.get('morningStartHour');
    const eveningStartHour = config.get('eveningStartHour');
    
    let themeName = 'ColorShift Material Pro';
    
    if (currentHour >= morningStartHour && currentHour < eveningStartHour) {
        themeName = 'ColorShift Material Pro - Morning';
    } else {
        themeName = 'ColorShift Material Pro - Evening';
    }
    
    vscode.workspace.getConfiguration('workbench').update('colorTheme', themeName, true);
}

/**
 * Deactivate the extension
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
}; 