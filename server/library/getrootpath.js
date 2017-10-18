var path = require ('path');
var directory = '';

var setRootDir = function(dir){
    directory = dir;
}  

var getRootDir = function(){
	return directory;
}


module.exports = {
	setRootDir: setRootDir,
	getRootDir: getRootDir
}