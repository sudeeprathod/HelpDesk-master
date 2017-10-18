var adminKey = 'admin';

var setAdminKey = function(key){
    adminKey = key;
}  

var getAdminKey = function(){
	return adminKey;
}


module.exports = {
	setAdminKey: setAdminKey,
	getAdminKey: getAdminKey
}