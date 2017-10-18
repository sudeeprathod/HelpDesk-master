var mongoose = require('mongoose');
var express = require('express');
//ar userModel = mongoose.model('User');

var getCount = function(email) {
	return this.constructor.find({'userName': email}).count().exec(function(err, result){
		 //console.log(email);
        if(!result){
            return Promise.reject();
        }
        return Promise.resolve(result);
	});

}

module.exports = {
	getCount: getCount
}