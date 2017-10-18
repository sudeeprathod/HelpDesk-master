var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = new Schema({
	public: {type: String},
    creator: {
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
    createdon: {type: Date},
    notes: {type: String},
    ticket:{
    	id:{
    		type:String
    	},

    	subject:{
    		type: String
    	},

    	ticketnum:{
    		type: String
    	}
    }

});

mongoose.model('Activity', activitySchema);