var mongoose = require('mongoose');
var autoInc = mongoose.model('AutoInc');

exports.mailFunc = function(sequenceName){
	
    	/*var sequenceDocument = db.counters.findAndModify({
          query:{_id: sequenceName },
          update: {$inc:{sequence_value:1}},
          new:true
      });*/
  
       autoInc.findOneAndUpdate({_id: sequenceName }, {$inc:{sequence_value:1}, function(err, res){
             return res.sequence_value;
       });

   
}