exports.randomStringGenerator = function(length){
	var generator = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var randomString = function(length, chars) {
	            var result = '';
	            for (var i = length; i > 0; --i) 
	                result += chars[Math.floor(Math.random() * chars.length)];
	            return result;
	}
	var rString = randomString(length, generator);
	return rString;
}