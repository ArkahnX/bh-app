function cache() {
	if(navigator.onLine) {
		$.ajax({
			url: "https://docs.google.com/spreadsheet/pub?key=0AqoKioNW1zO2dGRkLXo2a0xLd2kzVHhZT1NsRERGVEE&output=html",
			dataType: "html"
		}).done(function(value) {
			validate_file("main",value);
		});
	}
}

function validate_file(name,data) {
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(window.PERSISTENT, 5*1024*1024, function(fs) {
		fs.root.getFile(name+'.html', {}, function(fileEntry) {
			fileEntry.file(function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {
					if(this.result.length !== data.length) {
						if(this.result !== data) {
							write(name,data);
						}
					}
				};
				reader.readAsText(file);
			}, errorHandler);
		}, errorHandler);
	}, errorHandler);
}

function write(name,data) {
	// to prevent appending to the file, we will remove it first.
	fs.root.getFile(name+'.html', {create: false}, function(fileEntry) {
		fileEntry.remove(function() {
			console.log('File removed.');
		}, errorHandler);
	}, errorHandler);
	// after the file has been removed, we will recreate it with new content
	fs.root.getFile(name+'.html', {create: true}, function(fileEntry) {
		fileEntry.createWriter(function(fileWriter) {
			fileWriter.onwriteend = function(e) {
				console.log('Write completed.');
			};
			fileWriter.onerror = function(e) {
				console.log('Write failed: ' + e.toString());
			};
			// Create a new Blob and write it to log.txt.
			var blob = new Blob([data], {type: 'text/html'});
			fileWriter.write(blob);
		}, errorHandler);
	}, errorHandler);
}

function onInitFs(fs) {

  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // fileEntry.isFile === true
    // fileEntry.name == 'log.txt'
    // fileEntry.fullPath == '/log.txt'

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

chrome.runtime.onInstalled.addListener(function() {
	cache();
});
chrome.runtime.onSuspend.addListener(function() { 
	// Do some simple clean-up tasks.
});
chrome.app.runtime.onLaunched.addListener(function() {
	cache();
	chrome.app.window.create('index.html', {
		width: 800,
		height: 600,
		minWidth: 800,
		minHeight: 600,
		left: 100,
		top: 100,
		type: 'shell'
	});
});