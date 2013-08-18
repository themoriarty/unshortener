Unshortener
===========

Chrome extension to unshorten t.co, bit.ly and other URL shorteners links

The idea is very simple: bring back that magical feeling when you new exactly where you'd be going after hitting that link.

# Installation

As simple as an idea, just go to https://chrome.google.com/webstore/detail/url-unshortener/hciiopljaekhmopgaghflgfnhhbbaclm

# How does it work?

It uses Chrome API to analyze HTTP requests that the extemsion itself is doing. Whenever it's asked to 'resolve' a URL, 
it does an HTTP request to that address and follows the redirect chain until the destination page is about to be hit. 
At that moment it cancels the request, so we don't do an unwanted request to our target page.

Some very special guys prefer to do javascript redirects (hello, t.co!), so following the redirects becomes slightly trickier, but still doable.