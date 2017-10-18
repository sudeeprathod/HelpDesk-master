var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var userSchema = new Schema({
	userName            : {type: String, default:'', required:true},
	firstName  			: {type:String,default:'',required:true},
	lastName  			: {type:String,default:'',required:true},
	email	  			: {
		                      type:String
		                     ,required:true
		                     ,unique:true
		                     ,validate:{
		                     	validator: validator.isEmail,
		                     	message: '{VALUE} is not a valid email'
		                     }
		                  },
	mobileNumber  		: {type:String, required:true, unique:true},
	password			: {type:String, required:true},
	forgotPass          : {type:String},
	admin               : {type:String},
	tokens              : [{
          access:{
          	type: String,
          	required: true
          },
          token:{
          	type: String,
          	required: true
          }
	}]

});

userSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'mobileNumber', 'userName']);
}


userSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abcxyz12345z]]').toString();
	user.tokens.push({
		access: access
	   ,token:  token
	});

	return user.save().then(function(success){
		return token;
	});
}

userSchema.statics.findByToken = function(token) {
	var user = this;
	var decoded;
	try{
        decoded = jwt.verify(token, 'abcxyz12345z]]');
	}catch(e){
         return Promise.reject();
	}

	return user.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
}

userSchema.statics.findByCredentials = function(email, password) {
	var user = this
	return user.findOne({email}).then(function(result){
		
        if(!result){
            return Promise.reject();
        }
        return new Promise(function(resolve, reject){
        	//console.log(result);
        	bcrypt.compare(password, result.password, function(err, res){
        		//console.log(res);

        		//console.log(err);
                if(res){
                  
                  resolve(result);
                }else{
                	reject();
                }
        	});
        });
	});

}

userSchema.statics.findByKey = function(email) {
	var user = this;
	return user.findOne({email}).then(function(result){
		 console.log(email);
        if(!result){
            return Promise.reject();
        }
        return Promise.resolve(result);
	});

}

/*userSchema.pre('save', function(next){
    var user = this;
    this.constructor.find({'userName': '/'+user.userName+'/d'}).count().exec(function(err, result){
    	if(result>1){
    		console.log('count'+result);
           user.userName = user.userName + result;
           next();
        }else{
        	console.log('un'+user.userName);
        	next();       	
        }
    });
});*/


userSchema.pre('save', function(next){
    var user = this;
    //console.log(this);


    
        if(user.isModified('password')){

	    	//console.log('password');
	        bcrypt.genSalt(10, function(err, salt){
	        	//console.log('err'||err);
	             bcrypt.hash(user.password, salt, function(err, hash){
	             	 //console.log('err'||err);
	                 user.password = hash;
	                 next();
	             });
	        });
	    }else{
	    	next();
	    }
    
    
});



mongoose.model('User', userSchema);