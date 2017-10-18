var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var userModel =  require('./User.model');
var getuserdetail = require('./../../library/getuserdetail');
var ticketSchema = new Schema({
	requestor: {
		email:{
			type: String
		},
		id:{
			type: String
		},
        mobile:{
			type: String
		},
        userName:{
			type: String
		}
	},
	subject: {type: String},
	type: {type: String},
    status: {type: String},
	priority: {type: String},
	group: {type:String},
	source: {type: String},
	agent: {
		email:{
			type: String
		},
		id:{
			type: String
		},
        mobile:{
			type: String
		},
        userName:{
			type: String
		}
	},
    description: {type: String},
    ticketNum:{type: Number, Default: 1},
    followers: [{
		email:{
			type: String
		},
		id:{
			type: String
		},
        mobile:{
			type: String
		},
        userName:{
			type: String
		}
	}],
    createdOn: {type: Date},
    dueBy: {type: Date},
    resolvedOn : {type: Date},
    lastUpdatedOn: {type: Date},
    lastUpdatedBy: {
    	email:{
			type: String
		},
		id:{
			type: String
		},
        mobile:{
			type: String
		},
        userName:{
			type: String
		}
    },
    attachment:[
    	{
	
		    
		    originalname: {type: String},
		    encoding: {type: String},
		    mimetype: {type: String},
		    destination: {type: String},
		    filename: {type: String},
		    path:{type: String},
		    size:{type: String}
		}
    ],
    customer:{
    	type:  String
    }



});
autoIncrement.initialize(mongoose.connection);
ticketSchema.plugin(autoIncrement.plugin, { model: 'Ticket', field: 'ticketNum', startAt: 1, incrementBy: 1 });

/*ticketSchema.statics.findByCredentials = function(ticketId, creator) {
	var ticket = this;
	return ticket.findOne({'_id': ticket._id}, function(err, result){
         if(err){
         	return Promise.reject();
         }else{
         	var allFollowers = result.followers;
         	if(allFollowers.indexOf()){

         	}
         	return Promise.reslove();
         }
	})*/
	/*return user.findOne({email}).then(function(result){
		
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
}*/



ticketSchema.pre('save', function(next){
    var ticket = this;
    //console.log(this);
    console.log('agent'+ticket.agent.email);
    console.log('agent.email');
    if(ticket.agent.email){
       getuserdetail.getDetail(ticket.agent.email).then(function(result){
        console.log('res'+result);

        ticket.agent.id = result._id;

        ticket.agent.mobile = result.mobileNumber;

        ticket.agent.userName = result.userName;

        ticket.followers.push({
        	id: result._id,
        	mobile:result.mobileNumber,
        	userName:result.userName,
        	email:ticket.agent.email
        });

        next();
        });	
    }else{
    	next();
    }
   
});

/*ticketSchema.pre('findOneAndUpdate', function(next){
    var ticket = this;
    console.log('this'+ticket.agent);
    if(ticket.agent){
       getuserdetail.getDetail(ticket.agent).then(function(result){
               ticket.agent.id = result._id;
               ticket.agent.mobile = result.mobileNumber;
               ticket.agent.userName = result.userName;   
               ticket.agent.email = result.email
               next();
       });
    }else{
    	next();
    }
   	
});*/

mongoose.model('Ticket', ticketSchema);