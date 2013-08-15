function shouldUnshorten(url)
{
    return (url.substr(0, 12) == "http://t.co/") || url.indexOf("http://bit.ly/") == 0;
}

var done = false;
function processElement(e){
    //console.log(e);
    if (!done && e && e.tagName && e.tagName.toLowerCase() == "a" && shouldUnshorten(e.href))
    {
	//e.href = "http://go.com/";
	//console.log(e.href);
	//e.style["color"] = "red";
	//document.write("<iframe style='display:hidden' src='" + e.href + "'></iframe>");
	chrome.runtime.sendMessage({resolveUrl: e.href}, function(response) {
	    //console.log(response.newUrl);
	    e.innerHTML = response.newUrl;
	    console.log(e.text);
	});
	//done = true;
    }
}

var m = new MutationObserver(function(mutations){
    for (var i = 0; i < mutations.length; ++i){
	var evt = mutations[i];
	if (evt.target){
	    processElement(evt.target);
	}
	if (evt.addedNodes){
	    for (var j = 0; j < evt.addedNodes.length; ++j){
		processElement(evt.addedNodes[j]);
	    }
	}
    }
});

for (var i = 0; i < document.links.length; ++i){
    processElement(document.links[i]);
}
m.observe(document, {"childList": true, "attributes": true, "subtree": true});
