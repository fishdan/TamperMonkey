// ==UserScript==
// @name        BeepOnTextArray
// @namespace   http://tampermonkey.net/
// @version     0.3
// @description Monitors a specific website for the presence of any string from a defined array and triggers browser notifications.
// @author      fishdan
// @match       https://www.auditmassachusetts.com
// @grant       unsafeWindow // Grants access to the website's JavaScript environment (use with caution). Not explicitly used in this version.
// @require     http://code.jquery.com/jquery-3.3.1.min.js // Includes the jQuery library for easier DOM manipulation.
// ==/UserScript==

(function() {
    'use strict';

    // **DEFINE THE ARRAY OF STRINGS TO SEARCH FOR HERE**
    const targetStrings = ["(0)", "New Ticket", "Urgent!", "Update Available"];

    // Release the "$" alias used by other JavaScript libraries on the page, if any.
    // We will use "jQuery" instead of "$" in this script.
    jQuery.noConflict();

    /**
     * Displays a browser notification to the user about a detected event.
     * @param {string} foundText The text that was detected (or a message if none was found).
     */
    function notifyUser(foundText) {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications.");
        } else if (Notification.permission === "granted") {
            // If permission is granted, create a notification
            new Notification("Text Detected!", {
                body: "Detected: '" + foundText + "' at " + new Date(),
                // Browsers control the sound for notifications. You cannot reliably specify a custom sound.
                // Some browsers might have default notification sounds.
            });
        } else if (Notification.permission !== "denied") {
            // Otherwise, ask for permission
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification("Text Detected!", {
                        body: "Detected: '" + foundText + "' at " + new Date(),
                    });
                }
            });
        }
        // If permission was denied, we can't show notifications.
    }

    /**
     * Reloads the current page.
     */
    function reloadPage() {
        // Reload the current web page.
        location.reload();
    }

    /**
     * Checks if any of the target strings are present on the page and sets up intervals for actions.
     */
    function checkForTargetStrings() {
        let foundMatch = false;
        let matchedString = "";

        // Iterate through the array of target strings.
        for (const text of targetStrings) {
            // Use the window.find() method to search for the current target string on the page.
            if (window.find(text)) {
                foundMatch = true;
                matchedString = text;
                break; // If a match is found, no need to check further.
            }
        }

        if (foundMatch) {
            // If any of the target strings were found on the page:
            // Set an interval to reload the page every 30,000 milliseconds (30 seconds).
            // This suggests that when a target string is present, the script periodically checks for further changes.
            clearInterval(reloadInterval); // Clear the alert interval if it was running.
            reloadInterval = setInterval(reloadPage, 30000);
            notifyUser("One of the target strings ('" + matchedString + "') is present.");
        } else {
            // If none of the target strings were found on the page:
            // Set an interval to call the notifyUser function every 3,000 milliseconds (3 seconds).
            // This suggests that the absence of the target strings indicates a new event that the user should be notified about.
            clearInterval(reloadInterval); // Clear the reload interval if it was running.
            reloadInterval = setInterval(() => notifyUser("None of the target strings found."), 3000);
        }
    }

    // Initialize a variable to hold the interval ID so we can clear it later.
    let reloadInterval;

    // Call the checkForTargetStrings function initially to set up the appropriate interval.
    checkForTargetStrings();

    // You can add more code here to perform other actions or enhance the functionality.
})();
