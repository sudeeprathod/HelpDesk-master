var multer = require('multer');
	
exports.fileUpload = function(app, req, res){
	
    //app.use(busboy());
     console.log(req.body); // form fields
      console.log(req.files); // form files
      console.log(req.file);
      //res.status(204).end();
    	
}

