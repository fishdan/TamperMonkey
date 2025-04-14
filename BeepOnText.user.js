// ==UserScript==
// @name        BeepOnText
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Monitors a specific website for the presence or absence of the text "(0)" and triggers actions accordingly.
// @author      You (Please replace with your name)
// @match       https://www.auditmassachusetts.com
// @grant       unsafeWindow // Grants access to the website's JavaScript environment (use with caution). Not explicitly used in this version.
// @require     http://code.jquery.com/jquery-3.3.1.min.js // Includes the jQuery library for easier DOM manipulation.
// ==/UserScript==

(function() {
    'use strict';

    // Release the "$" alias used by other JavaScript libraries on the page, if any.
    // We will use "jQuery" instead of "$" in this script.
    jQuery.noConflict();

    // Create a new HTML <audio> element to play a sound.
    var player = document.createElement('audio');
    // Set the source of the audio file to a notification sound.
    player.src = 'https://notificationsounds.com/soundfiles/a86c450b76fb8c371afead6410d55534/file-sounds-1108-slow-spring-board.mp3';
    // Tell the browser to preload the audio file in the background for faster playback.
    player.preload = 'auto';

    /**
     * Displays a pop-up window to notify the user about a detected event.
     */
    function alertUser() {
        // Open a new small browser window.
        var myWindow = window.open("", "mywindow", "width=200,height=100");
        // Write a message into the new window indicating a new ticket was detected and the current time.
        myWindow.document.write("<p>Detected a new ticket at " + new Date() + "</p>");
        // The following line was intended to play a sound notification but is currently commented out
        // due to browser restrictions on autoplaying audio without user interaction.
        // player.play();
        // The pop-up serves as the notification method until browser behavior changes.
    }

    /**
     * Reloads the current page.
     */
    function reloadPage() {
        // Reload the current web page.
        location.reload();
    }

    /**
     * Checks if the text "(0)" is present on the page and sets up intervals for actions.
     */
    if (window.find('(0)')) {
        // If the text "(0)" is found on the page:
        // Set an interval to reload the page every 30,000 milliseconds (30 seconds).
        // This suggests that when "(0)" is present, the script periodically checks for changes.
        setInterval(reloadPage, 30000);
    } else {
        // If the text "(0)" is NOT found on the page:
        // Set an interval to call the alertUser function every 3,000 milliseconds (3 seconds).
        // This suggests that the absence of "(0)" indicates a new event that the user should be notified about.
        setInterval(alertUser, 3000);
    }

    // You can add more code here to perform other actions or enhance the functionality.
})();
