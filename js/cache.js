function cache(name, value) {
	validate_file(name,value);
}

function validate_file(name,data) {
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(window.PERSISTENT, 5*1024*1024, function(fs) {
		fs.root.getFile(name+'.json', {create:true}, function(fileEntry) {
			fileEntry.file(function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {
					var dataString = JSON.stringify(data)
					if(this.result.length !== dataString.length) {
						if(this.result !== dataString) {
							write(fs,name,dataString);
						} else {
							console.log("no update needed.")
						}
					} else {
						console.log("no update needed.")
					}
				};
				reader.readAsText(file);
			}, errorHandler);
		}, errorHandler);
	}, errorHandler);
}

function write(fs,name,data) {
	// to prevent appending to the file, we will remove it first.
	fs.root.getFile(name+'.json', {create: false}, function(fileEntry) {
		fileEntry.remove(function() {
			console.log('File removed.');
			// after the file has been removed, we will recreate it with new content
			fs.root.getFile(name+'.json', {create: true}, function(fileEntry) {
				fileEntry.createWriter(function(fileWriter) {
					fileWriter.onwriteend = function(e) {
						console.log('Write completed.');
					};
					fileWriter.onerror = function(e) {
						console.log('Write failed: ' + e.toString());
					};
					// Create a new Blob and write it to log.txt.
					var blob = new Blob([data], {type: 'application/json'});
					fileWriter.write(blob);
				}, errorHandler);
			}, errorHandler);
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