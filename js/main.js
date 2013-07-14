var sourceURLS = {
	main:'https://docs.google.com/spreadsheet/pub?key=0AqoKioNW1zO2dGRkLXo2a0xLd2kzVHhZT1NsRERGVEE&output=html',
	novel:'https://docs.google.com/spreadsheet/pub?key=0AqoKioNW1zO2dEYyR3VGaHZHaEk0bVZ2NF9vbHFKQkE&output=html'
};

if(window.location.hash === "") {
	var _pagename = "main";
} else {
	var _pagename = window.location.hash.split("#")[1];
}
function setup(source) {
	console.log(source)
	var timeline_config = {
		width:              '100%',
		height:             '100%',
		source:             source,
		embed_id:           'timeline-embed',               //OPTIONAL USE A DIFFERENT DIV ID FOR EMBED
		start_at_end:       false,                          //OPTIONAL START AT LATEST DATE
		start_zoom_adjust:  '3',                            //OPTIONAL TWEAK THE DEFAULT ZOOM LEVEL
		hash_bookmark:      true,                           //OPTIONAL LOCATION BAR HASHES
		debug:              false,                           //OPTIONAL DEBUG TO CONSOLE
		maptype:            'watercolor',                   //OPTIONAL MAP STYLE
		css:                'css/timeline.css',     //OPTIONAL PATH TO CSS
		js:                 'js/timeline.js'    //OPTIONAL PATH TO JS
	};
	$(document).ready(function() {
		createStoryJS(timeline_config);
		$("body").on("click","a",function() {
			$("#timeline-embed").html("");
			var _pagename = $(this).attr("href").split("#")[1];
			if(navigator.onLine) {
				setup(sourceURLS[_pagename]);
			} else {
				window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
				window.requestFileSystem(window.PERSISTENT, 5*1024*1024, function(fs) {
					fs.root.getFile(_pagename+'.json', {}, function(fileEntry) {
						setup(fileEntry.toURL());
					}, errorHandler);
				}, errorHandler);
			}
		});
	});
}
console.log("Working online: ",navigator.onLine)
if(navigator.onLine) {
	setup(sourceURLS[_pagename]);
} else {
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(window.PERSISTENT, 5*1024*1024, function(fs) {
		fs.root.getFile(_pagename+'.json', {}, function(fileEntry) {
			setup(fileEntry.toURL());
		}, errorHandler);
	}, errorHandler);
}

function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('Error: ' + msg);
}