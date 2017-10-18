var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repliesSchema = new Schema({
	
    parent_id:{type: String},
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
    files:{}

});

mongoose.model('Reply', repliesSchema);