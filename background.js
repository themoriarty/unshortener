var g_registry = new Object();

function known(url){
    return g_registry[url];
}
function resolve(url){
    return g_registry[url];
}
function addIntermediate(url, iurl){
    g_registry[url].intermediate.push(iurl);
}
function addFinal(url, final_url){
    g_registry[url].finalUrl = final_url;
}
function addCb(url, cb){
    g_registry[url].data.cbs.push(cb);
}
function register(url, data){
    g_registry[url] = {"data": data, intermediate: new Array()};
}
function getData(url){
    return g_registry[url].data;
}
function respond(sendResponse, url){
    var data = resolve(url);
    sendResponse({newUrl: data.finalUrl, intermediateUrls: data.intermediate});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
	var url = request.resolveUrl;
	if (known(url)){
	    if (resolve(url).finalUrl){
		console.log("known url " + url);
		respond(sendResponse, url);
		return false;
	    } else{
		addCb(url, sendResponse);
		return true;
	    }
	}
	frame = document.createElement('iframe');
	frame.sandbox = "";
	frame.setAttribute('src', url);
	register(url, {frame: frame, cbs: [sendResponse]});
	document.body.appendChild(frame);	
	return true;
    });


var g_frameRegistry = new Object();
chrome.webRequest.onBeforeRequest.addListener(function(details){
    if (details.tabId != -1){
	return;
    }
    var url = details.url;
    if (known(url)){
	g_frameRegistry[details.frameId] = url;
	//console.log("frame registry: " + g_frameRegistry);
    } else{
	//console.log("beforeRequest: " + JSON.stringify(details));
	var start_url = g_frameRegistry[details.frameId];
	if (start_url){
	    if (shouldUnshorten(url)){
		addIntermediate(start_url, url);
		console.log("intermidiate url: " + url);
	    } else{
		console.log("final url: " + url);
		addFinal(start_url, url);
		document.body.removeChild(getData(start_url).frame);
		delete g_frameRegistry[details.frameId];
		for (var i in getData(start_url).cbs){
		    respond(getData(start_url).cbs[i], start_url);
		}
		getData(start_url).cbs = new Array();
		return {"cancel": true};
	    }
	}
    }

    //console.log("beforeRequest: " + JSON.stringify(details));
}, {urls: [ "<all_urls>" ], "windowId": -1, "tabId": -1, types: ["sub_frame"]}, ["blocking"]);

/*chrome.webRequest.onBeforeRedirect.addListener(function(details){
  console.log("beforeRedirect: " + JSON.stringify(details));
  },
  {urls: [ "<all_urls>" ]});*/
