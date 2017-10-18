var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var autoIncrement = new Schema({
	
    parent_id: {type: String},
    sequence : {type: Number}
});

mongoose.model('AutoInc', autoIncrement);