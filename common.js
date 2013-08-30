function PrefixDictionary(){
    this._prefixes = new Object();
    this._lens = new Object();
}
PrefixDictionary.prototype.add = function(prefix){
    this._prefixes[prefix] = true;
    this._lens[prefix.length] = true;
    return this;
}
PrefixDictionary.prototype.match = function(url){
    for (var len in this._lens){
	var s = url.substr(0, len);
	if (this._prefixes[s] == true){
	    if (url.substr(len).match(/^\w+$/)){
		return true;
	    }
	    return false;
	}
    }
    return false;
}

var g_prefixes = new PrefixDictionary();
g_prefixes.add("http://t.co/").add("http://ow.ly/").add("http://owl.li/").add("http://bit.ly/");
g_prefixes.add("http://tcrn.ch/").add("http://vk.cc/").add("http://lifehac.kr/").add("http://clck.ru/");
g_prefixes.add("http://tinyurl.com/").add("http://goo.gl/").add("http://j.mp/").add("http://fb.me/");

function shouldUnshorten(url){
    return g_prefixes.match(url);
}
