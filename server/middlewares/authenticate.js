var mongoose = require('mongoose');
var express = require('express');
var userModel = mongoose.model('User');
var ticketModel = mongoose.model('Ticket');
var adminkey = require('./../library/admin.utility');
var adminkey = require('./../library/responseGenerator');
var authenticate = function(req, res, next){
    var token = req.header('x-auth');
    userModel.findByToken(token).then(function(user){
          if(!user){
             res.status(401).send;
          }
          req.user = user;
          req.token = token;
          next();
    }).catch((e) => {
	    res.status(401).send();
	  });
}


var checkAdmin = function(req, res, next){
    if(req.user.admin == 'Y'){
        next();
    }else{
    	var myResponse = responseGenerator.generate(true,"authentication error"+err,401,null);
	      res.set({
	        'Content-Type': 'application/json',
	        'ETag': '12345',
	        'Access-Control-Allow-Origin': '*'
	      }).send(myResponse);
    }
}


var ticketDetail = function(req, res, next){
   ticketModel.findOne({'_id': req.params.ticketId}, function(err, result){
       if(err){
         var myResponse = responseGenerator.generate(true,"Invalid Ticket"+err,500,null);
	      res.set({
	        'Content-Type': 'application/json',
	        'ETag': '12345',
	        'Access-Control-Allow-Origin': '*'
	      }).send(myResponse);
       }else{
         req.ticket = result;
         next();
       }
   });
}

var agent = function(req, res, next){
    userModel.findOne({'email': req.body.agent}, function(err, result){
        if(err){
           var myResponse = responseGenerator.generate(true,"Invalid Agent"+err,500,null);
		      res.set({
		        'Content-Type': 'application/json',
		        'ETag': '12345',
		        'Access-Control-Allow-Origin': '*'
		      }).send(myResponse);
        }else if(!result){
            var myResponse = responseGenerator.generate(true,"Invalid Agent"+err,404,null);
		      res.set({
		        'Content-Type': 'application/json',
		        'ETag': '12345',
		        'Access-Control-Allow-Origin': '*'
		      }).send(myResponse);
        }else{
           req.agent = result;
           next();
        }
    });
}

var validateAdminKey = function(req, res, next){
	var adminkeyVal = adminkey.getAdminKey();
	if(adminkeyVal === req.body.admin){
        next();
	}else{
		var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
	}
}


var setAdminKey = function(req, res, next){
	adminkeyVal === req.body.admin
}

module.exports = {
	authenticate: authenticate,
	validateAdminKey: validateAdminKey,
	checkAdmin: checkAdmin,
	agent: agent,
	ticketDetail: ticketDetail
}