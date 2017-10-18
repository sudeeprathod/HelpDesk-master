var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repliesSchema = new Schema({
	
    parent_id: {type: String},
    originalname: {type: String},
    encoding: {type: String},

    folder:{type: String},
    mimetype: {type: String},
    destination: {type: String},
    filename: {type: String},
    path:{type: String},
    size:{type: String}
});

mongoose.model('File', repliesSchema);