function cacheAll() {
	cache("main","https://docs.google.com/spreadsheet/pub?key=0AqoKioNW1zO2dGRkLXo2a0xLd2kzVHhZT1NsRERGVEE&output=html");
}

chrome.runtime.onInstalled.addListener(function() {
	
});
chrome.runtime.onSuspend.addListener(function() { 
	// Do some simple clean-up tasks.
});
chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('main.html#main', {
		width: 800,
		height: 600,
		minWidth: 800,
		minHeight: 600,
		left: 100,
		top: 100,
		type: 'shell'
	});
});