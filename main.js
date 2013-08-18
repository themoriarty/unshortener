function processElement(e){
    if (e && e.tagName && e.tagName.toLowerCase() == "a" && shouldUnshorten(e.href))
    {
	chrome.runtime.sendMessage({resolveUrl: e.href}, function(response) {
	    if (response){
		var redirectUrls = [e.href];
		for (var i = 0; i < response.intermediateUrls.length; ++i){
		    redirectUrls.push(response.intermediateUrls[i]);
		}
		//console.log(JSON.stringify(redirectUrls) + " => " + response.newUrl);
		for (var i in redirectUrls){
		    if (e.innerHTML.indexOf(redirectUrls[i]) >= 0){
			e.innerHTML = e.innerHTML.replace(redirectUrls[i], response.newUrl);
			return;
		    }
		}
		for (var i in redirectUrls){
		    var schemaLessUrl = redirectUrls[i].replace(/^\w+:\/\//, "");
		    if (e.innerHTML.indexOf(schemaLessUrl) >= 0){
			e.innerHTML = e.innerHTML.replace(schemaLessUrl, response.newUrl);
			return;
		    }
		}
		//e.innerHTML = response.newUrl;
	    }
	});
    }
}

function processTree(t){
    processElement(t);
    if (t.getElementsByTagName){
	var as = t.getElementsByTagName("a");
	for (var i = 0; i < as.length; ++i){
	    processElement(as[i]);
	}
    }
}

for (var i = 0; i < document.links.length; ++i){
    processElement(document.links[i]);
}

var m = new MutationObserver(function(mutations){
    for (var i = 0; i < mutations.length; ++i){
	var evt = mutations[i];
	if (evt.target){
	    processTree(evt.target);
	}
	if (evt.addedNodes){
	    for (var j = 0; j < evt.addedNodes.length; ++j){
		processTree(evt.addedNodes[j]);
	    }
	}
    }
});
m.observe(document, {"childList": true, "attributes": true, "subtree": true});
