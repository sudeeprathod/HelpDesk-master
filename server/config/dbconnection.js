//a module to use databse connection
var exports = module.exports = {};

var mongoose = require('mongoose');

//var autoIncrement = require('mongoose-auto-increment');

var dbPath = 'mongodb://localhost/ensemblework';



db = mongoose.connect(dbPath);

//autoIncrement.initialize(db);

mongoose.connection.once('open', function(){
  console.log("database connection is open");
});

/*exports.getConnection = function(){
   var Blog = require('./blogModel.js');

   var blogModel = mongoose.model('Blog');

   return blogModel;
}*/