// Manages a single tab connection



var communicator = (function() {
    // Register this tab to the background script
    var port = chrome.extension.connect();
    var disconected = false;

    port.onDisconnect.addListener(function() {
        disconected = true;
    })


    // Public methods
    return {
        /**
         * A 'request' is a message from the content script sent to the background script
         * @param message
         * @param callback
         */
        request: function(event, message, callback) {
            callback = typeof callback != 'undefined' ? callback : function() {};
            if (disconected) {
                return callback();
            }

            var notification = {
                event: event,
                message: message
            };

            chrome.extension.sendMessage(notification, callback);
        },

        /**
         * Is called when a background script calls 'communicator.notify'
         * @param event
         * @param callback
         */
        on: function(event, callback) {
            var self = this;

            callback = typeof callback != 'undefined' ? callback : function() {};
            if (disconected) {
                return callback();
            }

            if (event == 'disconected') {
                port.onDisconnect.addListener(function() {
                    disconected = true;
                    callback(true);
                })

                return;
            }



            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                if (request.event == event) {
                    sendResponse && sendResponse(callback.call(self, request.message, sender));
                }
            });
        }
    }
})();