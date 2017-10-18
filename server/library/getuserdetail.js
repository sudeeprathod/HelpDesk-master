var mongoose = require('mongoose');
var express = require('express');
var userModel = mongoose.model('User');
var getDetail = function(userEmail){
    console.log('agentLib'+userEmail);
      return userModel.findByKey(userEmail).then(function(result){
        if(!result){
             Promise.reject();
        }
        return Promise.resolve(result);
      });
}

module.exports = {
	getDetail: getDetail
}