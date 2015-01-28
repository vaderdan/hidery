var sendEvent = function(event,details){
	var event = new CustomEvent(event, { detail: details, bubbles: true, cancelable: true });
	document.dispatchEvent(event);
}

var getImageUrls = function(element){
	var images = element.find('img');

	var urls = [];

	for(var i = 0; i < images.length; i++){
		var url = jQuery(images[i]).attr('src');
		urls.push(url);
	}

	return urls;
}

var sendImageUrls = function(){
	var images = getImageUrls(jQuery('body'));
	sendEvent('domImages', {images: images});
}



var httpTempOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(a,b) {
	httpTempOpen.apply(this, arguments);

	sendImageUrls();
	sendEvent('ajaxImages');
};



//make only the new items to be sent as update on ajax