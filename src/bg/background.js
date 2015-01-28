var is_enabled = true
var delete_recent = false; //before 1h

chrome.browserAction.onClicked.addListener(function(){
	is_enabled = !is_enabled;
	if(is_enabled){
		chrome.browserAction.setIcon({path: chrome.extension.getURL("icons/icon19_on.png")});
		sendDubImage();
	}
	else{
		chrome.browserAction.setIcon({path: chrome.extension.getURL("icons/icon19_off.png")});
		communicator.notify('dubImagesReset');
	}
});



// !-init - inject scripts
communicator.on('tabId', function(message, sender) {
	if(typeof sender != 'undefined' && typeof sender.tab != 'undefined' && typeof sender.tab.id != 'undefined'){
		chrome.tabs.executeScript(sender.tab.id, {file: "js/jquery/jquery.js", runAt: "document_end"}, function(){
			chrome.tabs.executeScript(sender.tab.id, {file: "js/underscore.js", runAt: "document_start"}, function(){
				chrome.tabs.executeScript(sender.tab.id, {file: "src/content/inject.js", runAt: "document_start"}, function(){
					sendDubImage();
					saveAllNew();
				});
			});	
		});
	}
})




// !-recieve dom images and save them

communicator.on('domImages', function(message, sender) {
	save(message.images);
});

communicator.on('ajaxImages', function(message, sender) {
	sendDubImage();
});


// !-send dublicate images
var sendDubImage = _.debounce(function(){
	if(is_enabled){
		load(function(data){
			communicator.notify('dubImages', {images: data});
		})
	}
}, 0);



// !-save/load helpers

var clear = function(){
	chrome.storage.local.clear();
}


var saveAllNew = function(){
	chrome.storage.local.get('images', function(result) {
		if (typeof result.images == 'undefined') {
		    result.images = {};
		}

		for(var key in result.images){
			result.images[key].new = false;


			if(delete_recent && typeof result.images[key].created_at != 'undefined'){
				if(moment(result.images[key].created_at).isAfter(moment(new Date()).subtract('hours', 1))){
					delete result.images[key];
				}
			}
		}

		

		chrome.storage.local.set({
	        'images': result.images
	    });
	});
}

var save = function(data){
	if(typeof data == 'undefined'){
		return;
	}


	load(function(loadData){
		var saveData = loadData;
		for(var key in data){
			if(typeof saveData[data[key]] != 'undefined'){
				saveData[data[key]].count ++
			}
			else{
				saveData[data[key]] = { count: 1, new: true, created_at:  moment().valueOf()};
			}
		}

		chrome.storage.local.set({
	        'images': saveData
	    });
	});
}

var load = function(call){
	chrome.storage.local.get('images', function(result) {
		if (typeof result.images == 'undefined') {
		    result.images = {};
		}

		call(result.images);
	});
}


// !-clears all images on extension reload  
clear();
