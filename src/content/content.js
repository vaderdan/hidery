var sendEvent = function(event,details){
	var event = new CustomEvent(event, { detail: details, bubbles: true, cancelable: true });
	document.dispatchEvent(event);
}

// !- init

communicator.request('tabId', {});



// !-dom loaded with images

document.addEventListener("domImages", function(e) {
	communicator.request('domImages', e.detail);
}, false);

document.addEventListener("ajaxImages", function(e) {
	communicator.request('ajaxImages', e.detail);
}, false);


// !- send dublicate images

communicator.on('dubImages', function(message){
	sendEvent('dubImages', message);
});

communicator.on('dubImagesReset', function(message){
	sendEvent('dubImagesReset', message);
});

