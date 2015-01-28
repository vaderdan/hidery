console.log("inject");

var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

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


var hideImages = function(images){
	for(var key in images){
		if(images[key].count <= 1 || images[key].new == true){
			continue;
		}



		var img = jQuery('img[src="'+key+'"]');



		if(img.length == 0){
			continue;
		}

		

		if(img.outerWidth() < 20 || img.outerHeight() < 20){
			continue;
		}

		
		
		function isSelector(element, index, array) {
		  return  element.selectorText === 'html body img.d_simg_hidden[src~="'+img.attr('src')+'"]';
		}

		
	
		if(img.outerWidth() > 100 && img.outerHeight() > 100){
			img.css('background-image', '-webkit-linear-gradient(top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('+img.attr('src')+')');
			if(img.outerWidth() < 200){
				img.css('font-size', '50%');	
			}
			else{
				img.css('font-size', '100%');	
			}
		}
		else{
			img.css({'background': 'red', 'border-radius': '0px'});
			img.addClass('d_simg_hidden_after');
		}
	
				
		
	

		img.addClass('d_simg_hidden');

		if(img.outerHeight() < 100){
			img.removeClass('d_simg_hidden')
			img.addClass('d_simg_hidden2');
		}
	}
}



// !-send loaded images
jQuery().ready(function(){
	
	sendImageUrls();

	var s = document.createElement("script");
	s.src = chrome.extension.getURL("src/content/xmlhttprequest_override.js");
	(document.head||document.documentElement).appendChild(s);
});




// !-get dublicate images
//dublicate images
document.addEventListener("dubImages", function(e) {
	if(typeof e.detail == 'undefined' || typeof e.detail.images == 'undefined'){
		return;
	}

	hideImages(e.detail.images);
}, false);


document.addEventListener("dubImagesReset", function(e) {
	jQuery('img').css('opacity', 1);
	jQuery('img').removeClass('d_simg_hidden');
}, false);



