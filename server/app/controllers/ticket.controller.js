var mongoose = require('mongoose');
var express = require('express');

var ticketRouter = express.Router();
var userTicket = mongoose.model('Ticket');
var ticketReply = mongoose.model('Reply');
var ticketFile = mongoose.model('File');
var userModel = mongoose.model('User');
var userActivity = mongoose.model('Activity');
var responseGenerator = require('./../../library/responseGenerator');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var mailer = require('./../../library/email');
var randomString = require('./../../library/randomString');
var fileUpload = require('./../../library/file.utility');
var currentPath = require('./../../library/getrootpath');

var multer = require('multer');
var path = require ('path');
var multiparty = require('multiparty');

var authenticate = require('./../../middlewares/authenticate');
var fs = require('fs');
var busboy = require('connect-busboy');
/*var multer = require('multer');
var upload = multer({dest: 'uploads/'});*/
var formidable = require('formidable');
var async = require('async');

module.exports.controllerFunction = function(app){
     //app.use(multer({ dest: './uploads/'}))
     eventEmitter.on('send email', function(creator, subject, ticketId, text){
        /*var recepient = [];
        recepient.push('pallabidas0492@gmail.com');
        recepient.push(creator);*/
        var text = text;
        var subject = subject;
        var mailResponse = mailer.mailFunc(subject, creator, text, function(mailResponse){
          console.log('email send'+mailResponse);
        });
     });

     eventEmitter.on('remove temp', function(file){
         if(fs.existsSync(file)){
          try{
            fs.unlinkSync(file);
          }catch(e){
            console.log('some error in deleting file'+e);
          }
         }
     });
     
     eventEmitter.on('save activity', function(userId, msg, ticketId){
         async.parallel({
             one: function(parallelcb){
                      userModel.findOne({'_id': userId}, function(err, res){
                         parallelcb(null, {err:err, res:res});
                       });
                  },
                   

              two: function(parallelcb){
                       userTicket.findOne({'_id': ticketId}, function(err, res){
                               parallelcb(null, {err:err, res:res});
                         });
                   }

              
          }, function(err, results){
            //console.log(results);
             var activity = new userActivity({
                'creator.email': results.one.res.email,
                'creator.id': results.one.res._id,
                'creator.mobile': results.one.res.mobileNumber,
                'creator.userName': results.one.res.userName,
                'ticket.id': results.two.res._id,
                'ticket.subject': results.two.res.subject,
                'ticket.ticketnum': results.two.res.ticketNum,
                'notes': msg,
                'createdon': new Date()
             });

             activity.save(function(err, result){
                 if(err){
                    console.log('Event save activity Error:-'+err);
                 }
             });
         });
         
     });

    ticketRouter.get('/allacitvities/ticket/:ticketId/:pageNum', authenticate.authenticate, function(req, res){
         console.log('1'+req.params.pageNum);
         console.log('1'+req.params.ticketId);
         var count = parseInt(req.params.pageNum) + 1;
         var skipData = parseInt(req.params.pageNum) - 1;
         skipData *=  10;  
         userActivity.find({'ticket.id':req.params.ticketId}).skip(skipData).sort('-createdon').limit(10).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all ticket by page. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
        
            }else{
              if(result.length === 0){
                count = undefined;
              }
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }
         });
    });

    ticketRouter.get('/allacitvities/user/:user/:pageNum', authenticate.authenticate, function(req, res){
         console.log(req.params.pageNum);
         console.log(req.params.userId);
         var count = parseInt(req.params.pageNum) + 1;
         var skipData = parseInt(req.params.pageNum) - 1;
         skipData *=  10;  
         userActivity.find({'creator.userName':req.params.user}).skip(skipData).sort('-createdon').limit(10).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all user activities. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else{
              if(result.length === 0){
                count = undefined;
              }
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*',
                'link': count
              }).send(myResponse);
            }
         });
    });

    ticketRouter.get('/allacitvities/:pageNum', [authenticate.authenticate, authenticate.checkAdmin], function(req, res){
         var count = parseInt(req.params.pageNum) + 1;
         var skipData = parseInt(req.params.pageNum) - 1;
         skipData *=  10;  
         userActivity.find({}).skip(skipData).sort('-createdon').limit(10).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all activities. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else{
              if(result.length === 0){
                count = undefined;
              }
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*',
                'link': count
              }).send(myResponse);
            }
         });
    });

     ticketRouter.get('/alltickets/check/:pageNum', authenticate.authenticate, function(req, res){
         console.log(req.header('x-auth'));
         var count = parseInt(req.params.pageNum) + 1;
         var skipData = parseInt(req.params.pageNum) - 1;
         skipData *=  10;
         userTicket.find({}).skip(skipData).sort('-createdOn').limit(10).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all ticket page. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
        
            }else{
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*',
                'link': count
              }).send(myResponse);
            }
         });
    });


      ticketRouter.get('/alltickets', [authenticate.authenticate, authenticate.checkAdmin], function(req, res){
         userTicket.find({}).sort('-createdOn').exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all tickets. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else{
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }
         });
    });


    //<<<<<<<<<<<<<<<<<<Rote to get the Aggregate from Database>>>>>>>>>>>>>>>>>>>>>>>>>>///
      ticketRouter.get('/alltickets/aggregate/priority', [authenticate.authenticate, authenticate.checkAdmin], function(req, res){
         userTicket.aggregate([{ $match : { status : "Open" } }, {$group: {_id: "$priority", count:{$sum:1}}}]).exec(function(err, result){
            if(err){
              console.log('An error occured while getting priority count. Error:-'+err);
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else{
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }
         });

      });


      ticketRouter.get('/alltickets/aggregate/status', [authenticate.authenticate, authenticate.checkAdmin], function(req, res){
         userTicket.aggregate([{$group: {_id: "$status", count:{$sum:1}}}]).exec(function(err, result){
            if(err){
              console.log('An error occured while gettng status count. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else{
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }
         });

      });


      ticketRouter.get('/alltickets/aggregate/agent', [authenticate.authenticate, authenticate.checkAdmin], function(req, res){
          
         userTicket.aggregate([{$group: {_id: "$agent", count:{$sum:1}}}]).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all agent count. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else{

            var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }
         });

      });
    //<<<<<<<<<<<<<<<<<<Aggregate route ends here>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>///

    ticketRouter.get('/singleticket/:ticketId', authenticate.authenticate,  function(req, res){
         var allData= {};
         userTicket.findOne({'_id': req.params.ticketId}, function(err, result){
            if(err){
              console.log('An error occured while retrieving ticket details. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else if(!result || result.length == 0 || result == undefined){
                  console.log('No data found for ticket. Error:-'+req.params.ticketId);
                  var myResponse = responseGenerator.generate(true,"some error"+err,404,null);
                    res.set({
                      'Content-Type': 'application/json',
                      'ETag': '12345',
                      'Access-Control-Allow-Origin': '*'
                    }).send(myResponse);
             }else{
                 ticketFile.find({'parent_id': req.params.ticketId}, function(err, data){
                        if(err){
                           console.log('An error occured while retrieving ticket details. Error:-'+err);
                          var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                          res.set({
                            'Content-Type': 'application/json',
                            'ETag': '12345',
                            'Access-Control-Allow-Origin': '*'
                          }).send(myResponse);

                        }else if(!data || data.length == 0 || data == undefined){
                              var myResponse = responseGenerator.generate(false,"success",200,result);
                              res.set({
                                'Content-Type': 'application/json',
                                'ETag': '12345',
                                'Access-Control-Allow-Origin': '*'
                              }).send(myResponse);

                        }else{
                           result.attachment = [];
                           for(var indx in data){
                             if(data[indx].filename){
                                result.attachment.push(data[indx]);
                             }
                              
                           }
                           result.attachment.push(data);
                           var myResponse = responseGenerator.generate(false,"success",200,result);
                            res.set({
                              'Content-Type': 'application/json',
                              'ETag': '12345',
                              'Access-Control-Allow-Origin': '*'
                            }).send(myResponse);
                        }
                 });
                
            }
         });
    });

    ticketRouter.get('/alltickets/aggregate/dueBy', [authenticate.authenticate, authenticate.checkAdmin], function(req, res){
          //var data = {}
         userTicket.aggregate([{ $match : { status : "Open" } }, {$group: {_id: {dueBy: {$dateToString:{format:"%Y-%m-%d", date: "$dueBy"}}}
          , count:{$sum:1}}}]).exec(function(err, result){
            if(err){
              console.log('An error occured while retrieving all dueby Ticket. Error:-'+err);
              var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }else{
              var myResponse = responseGenerator.generate(false,"success",200,result);
              res.set({
                'Content-Type': 'application/json',
                'ETag': '12345',
                'Access-Control-Allow-Origin': '*'
              }).send(myResponse);
            }
         });

      });
    
    ticketRouter.post('/file/upload/:ticketId', authenticate.authenticate, function(req, res){
            var dir = './uploads/'+req.user.userName;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            for(indx in req.files){
                var readerStream = fs.createReadStream('./uploads/'+req.files[indx].filename);
                var filePath = '/uploads/'+req.files[indx].filename; 
                var dirName = currentPath.getRootDir();
                dirName += filePath;
                // Create a writable stream
                var writerStream = fs.createWriteStream(dir+'/'+req.files[indx].filename+req.files[indx].originalname);

                writerStream.on('pipe',function(source){
                  console.log("piping is being done ");
                  eventEmitter.emit('remove temp', dirName);
                  // you can also unpipe 

                });// end on pipe

                // Pipe the read and write operations
                readerStream.pipe(writerStream);

                readerStream.on('end',function(){
                  //fs.unlinkSync(dirName);
                  console.log("end of read stream");
                });

                writerStream.on('finish',function(){
                  //fs.unlinkSync(dirName);
                  //console.log(dirName);
                  console.log("end of writer stream");
                });
            }
              if(req.files){
                for(var data in req.files){
                    //data.fieldname;
                    //console.log(data);
                    var filePath = './uploads/'+req.user.userName+'/'+req.files[data].filename+req.files[indx].originalname;
                    var fileData = new ticketFile;
                    var filename = req.files[data].filename+req.files[indx].originalname;
                    var originalname = req.files[indx].originalname;
                    var encoding = req.files[indx].originalname;

                    var mimetype = req.files[indx].mimetype;
                    var destination = req.files[indx].destination;
                    var filename = req.files[indx].filename;
                    var path = req.files[indx].path;
                    var size = req.files[indx].size;

                    var fileData = new ticketFile({

                        parent_id: req.params.ticketId,
                        filename : req.files[data].filename+req.files[indx].originalname,
                        originalname : req.files[indx].originalname,
                        encoding : req.files[indx].originalname,
                        folder: req.user.userName,
                        mimetype :req.files[indx].mimetype,
                        destination :req.files[indx].destination,
                        path :req.files[indx].path,
                        size :req.files[indx].size
                    });

                    fileData.save(function(err, result){
                       if(err){
                          console.log('some error occured while creating product. ERR:-'+err);
                          var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                          //res.send(myResponse);
                       }else{
                            var myResponse = responseGenerator.generate(false,"success",200,result);
                       }
                    });


                }
               
                res.set({
                  'Content-Type': 'application/json',
                  'ETag': '12345',
                  'Access-Control-Allow-Origin': '*'
                }).send({data:'ok'});
              }
              
    });
//app.use(multer({ dest: './uploads/'}).any()); //app.use(express.static(path.resolve(__dirname,'./../public')));
    ticketRouter.get('/files/:filename', function(req, res){
           ticketFile.findOne({'filename': req.params.filename}, function(err, result){
               if(err){
                  console.log('some error occured while creating product. ERR:-'+err);
                  var myResponse = responseGenerator.generate(true,err,500,null);
                  res.send(myResponse);
               }else{
                   //res.set();
                   console.log(path.resolve(__dirname));
              
                   var dirName = currentPath.getRootDir();
                   var userDir = result.folder;
                   //var default = "uploads";
                   var finalPath = dirName + '/' + 'uploads' + '/' + userDir;                
                   res.set('Content-Type: '+result.mimetype).sendFile(path.resolve(finalPath+'/' + result.filename));
               }
           });   
    });

    ticketRouter.post('/createticket',  authenticate.authenticate,  function(req, res){

        

        //res.send('ok');
        //console.log(req.token);
        var followerArray = [];
        var createDate = new Date();
        var resolveDate = new Date();
        var priorityDays = 2;
        var normalDays = 3;
        var lowDays= 4;
        var agentDetail = {};
       
        //var ticketNum = autoInc.getNextSequenceValue("ticketId");

        followerArray.push({
          id: req.user._id,
          mobile:req.user.mobileNumber,
          userName:req.user.userName,
          email:req.user.email
        });

        

        if(req.body.priority == 'Critical'){
            resolveDate.setDate(createDate.getDate() + priorityDays);
        }else if(req.body.priority == 'Medium'){
             resolveDate.setDate(createDate.getDate() + normalDays);
        }else{
             resolveDate.setDate(createDate.getDate() + lowDays);
        }

        var newTicket = new userTicket({
            'requestor.id'   : req.user._id,
            'requestor.email'   : req.user.email,
            'requestor.mobile'   : req.user.mobileNumber,
            'requestor.userName'   : req.user.userName,
            subject     : req.body.subject,
            type        : req.body.type,
            status      : req.body.status,
            priority    : req.body.priority,
            group       : req.body.group,
            source      : req.body.source,
            'agent.email': req.body.agent,
            description : req.body.description,
            //ticketNum   : ticketNum,
            followers   : followerArray,
            createdOn   : createDate,
            dueBy       : resolveDate,
            customer    : 'N'
        });
        
        newTicket.save(function(err, result){
            if(err){
               console.log('some error occured while creating ticket. ERR:-'+err);
               var myResponse = responseGenerator.generate(true,err,500,null);
               res.send(myResponse);
              

            }
            else{
                eventEmitter.emit('save activity', req.user._id, 'created ticket', result._id);
                 var myResponse = responseGenerator.generate(false,"success",200,result);
                  res.set({
                    'Content-Type': 'application/json',
                    'ETag': '12345',
                    'Access-Control-Allow-Origin': '*'
                  }).send(myResponse);
                 
            }
              
        });

    });
		
    ticketRouter.put('/update/:ticketId', authenticate.authenticate, authenticate.agent, function(req, res){
         var update = req.body;
         console.log(req);
         
         userTicket.findOneAndUpdate({'_id': req.params.ticketId}, {$set: {
               'status': req.body.status,
               'priority': req.body.priority,
               'type': req.body.type,
               'agent.email': req.body.agent,
               'agent.id': req.agent._id,
               'agent.mobile': req.agent.mobileNumber,
               'agent.userName': req.agent.userName
         }}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                     var myResponse = responseGenerator.generate(false,"success",200,result);
                      res.set({
                        'Content-Type': 'application/json',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).send(myResponse);

              if(req.body.status != result.status){
                eventEmitter.emit('save activity', req.user._id, 'updated status for ticket', result._id);
                var text = req.user.userName+' changed status of ticket:-'+result.ticketNum;
                var subject = 'Status Changed of Ticket# '+result.ticketNum;
              }
              if(req.body.priority != result.priority){
                eventEmitter.emit('save activity', req.user._id, 'changed priority for ticket', result._id);

                var text = req.user.userName+' changed priority of ticket:-'+result.ticketNum;
                var subject = 'Priority Changed of Ticket# '+result.ticketNum;
              }

              if(req.body.type != result.type){
                eventEmitter.emit('save activity', req.user._id, 'changed ticket type of ticket', result._id);
                var text = req.user.userName+' changed type of ticket:-'+result.ticketNum;
                var subject = 'Ticket Type Changed for Ticket# '+result.ticketNum;
              }
              if(result.agent || result.agent===""){
                if(result.agent.email != req.body.agent){
                   eventEmitter.emit('save activity', req.user._id, 'changed agent for ticket', result._id);
                   var text = 'New Agent has been assigned for ticket:-'+result.ticketNum+' Agent-'+req.agent.userName;
                   var subject = 'Agent Changed for Ticket# '+result.ticketNum;
                   var recepient = result.requestor.email+' , '+req.body.agent;
                   var copy = req.user.email+' , '+ req.agent.email;
                }
                
              }else{
                 if(req.body.agent){
                    eventEmitter.emit('save activity', req.user._id, 'assigned agent for ticket', result._id);
                    var text = 'Agent '+req.agent.userName+' assigned for ticket:-'+result.ticketNum;
                    var subject = 'Agent Assigned to Ticket# '+result.ticketNum;
                    var recepient = result.requestor.email+' , '+req.body.agent;
                    var copy = req.user.email;
                 }
              }
                 
                  

                  eventEmitter.emit('send email', recepient, subject, copy, text);
              }
         });
    });

    ticketRouter.post('/delete/:ticketId', authenticate.authenticate, function(req, res){
         userTicket.remove({'_id': req.params.ticketId}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{
                    ticketReply.remove({'parent_id': req.params.ticketId}, function(err, result){
                        if(err){
                                console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                                res.send(myResponse);
                              }else{
                                 //eventEmitter.emit('save activity', req.user._id, 'deleted ticket', req.params.ticketId);
                                 res.set({
                                    'Content-Type': 'application/json',
                                    'ETag': '12345',
                                    'Access-Control-Allow-Origin': '*'
                                  }).status('200').send(result);
                          }
                    });
              }
         });
    });

    ticketRouter.post('/delete/:ticketId/reply/:replyId', authenticate.authenticate, function(req, res){
         ticketReply.remove({'_id': req.params.replyId}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                     res.set({
                        'Content-Type': 'application/json',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status('200').send(result);
                     //eventEmitter.emit('save activity', req.user._id, 'deleted reply on ticket', req.params.ticketId);
              }
         });
    });

/*    ticketRouter.post('/delete', authenticate.authenticate, function(req, res){
         userTicket.remove({}, function(err, result){
              if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                  }else{

                     res.set({
                          'Content-Type': 'application/json',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*'
                        }).status('200').send(result);
              }
         });
    });*/

    /*ticketRouter.get('/getallreply/:ticketId', authenticate.authenticate, function(req, res){
           ticketReply.find({'parent_id': req.params.ticketId}, function(err, result){
                 if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                 }else{
                    res.set({
                          'Content-Type': 'application/json',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*'
                        }).status('200').send(result);
                 }
           });    
    });*/

    ticketRouter.get('/getallreply/:ticketId', authenticate.authenticate, function(req, res){
            var allData= {};
           ticketReply.find({'parent_id': req.params.ticketId}, function(err, result){
                 if(err){
                    console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                    res.send(myResponse);
                 }else{
                    for(var indx in result){
                            ticketFile.find({'parent_id': result[indx]._id}, function(err, data){
                              console.log('file:-'+result[indx]._id);
                                 if(err){
                                     console.log('file Err:-'+err);
                                     var myResponse = responseGenerator.generate(false,"success",200,result);
                                      res.set({
                                        'Content-Type': 'application/json',
                                        'ETag': '12345',
                                        'Access-Control-Allow-Origin': '*'
                                      }).send(result);
                                 }else{
                                    result[indx].attachment = [];
                                     for(var data in data){
                                       if(data[data].filename){
                                          result[indx].attachment.push(data[data]);
                                       }
                                        
                                     }
                                     result[indx].attachment.push(data);
                                 }
                            });
                    }
                    var myResponse = responseGenerator.generate(false,"success",200,result);
                                res.set({
                                  'Content-Type': 'application/json',
                                  'ETag': '12345',
                                  'Access-Control-Allow-Origin': '*'
                                }).send(result);
                     /*ticketFile.find({'parent_id': result._id}, function(err, data){
                            if(err){
                                 console.log('An error occured while retrieving ticket details. Error:-'+err);
                                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                                res.set({
                                  'Content-Type': 'application/json',
                                  'ETag': '12345',
                                  'Access-Control-Allow-Origin': '*'
                                }).send(result);
                              }else if(!data || data.length == 0 || data == undefined){
                                  var myResponse = responseGenerator.generate(false,"success",200,result);
                                  res.set({
                                    'Content-Type': 'application/json',
                                    'ETag': '12345',
                                    'Access-Control-Allow-Origin': '*'
                                  }).send(result);

                            }else{
                               result.attachment = [];
                               for(var indx in data){
                                 if(data[indx].filename){
                                    result.attachment.push(data[indx]);
                                 }
                                  
                               }
                               result.attachment.push(data);
                               var myResponse = responseGenerator.generate(false,"success",200,result);
                                res.set({
                                  'Content-Type': 'application/json',
                                  'ETag': '12345',
                                  'Access-Control-Allow-Origin': '*'
                                }).send(result);
                            }
                     });*/
                    /*res.set({
                          'Content-Type': 'application/json',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*'
                        }).status('200').send(result);*/
                 }
           });    
    });
    
    ticketRouter.post('/reply/:ticketId', authenticate.authenticate, authenticate.ticketDetail, function(req, res){
          console.log(req.body);
          var createdBy = {
                            id: req.user._id,
                            mobile:req.user.mobileNumber,
                            userName:req.user.userName,
                            email:req.user.email
                          };
          var newReply = new ticketReply({
              parent_id : req.params.ticketId,
              creator   : createdBy,
              createdon : new Date(),
              notes     : req.body.text
            });

          newReply.save(function(err, result){
            if(err){
                  console.log('An error occured while updating ticket.'+req.params.ticketId+' Error:-'+err);
                  var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                  res.send(myResponse);
                }else{
                  var text = req.user.userName+' replied on ticket:-'+req.ticket.ticketNum;
                  var subject = 'Response Received on Ticket# '+req.ticket.ticketNum;
                  var recepient = '';
                  var copy ='';
                  if(req.ticket.requestor.email === req.user.email){
                     recepient = req.ticket.agent.email;
                     copy = req.ticket.requestor.email;
                  }else if(req.user.email === req.ticket.agent.email){
                     recepient = req.ticket.requestor.email
                     copy = req.user.email;+''+ req.ticket.agent.email;
                  }else{
                     recepient = req.ticket.requestor.email
                     copy = req.user.email+', '+ req.ticket.agent.email;
                  }

                  eventEmitter.emit('send email', recepient, subject, copy, text);

                  eventEmitter.emit('save activity', req.user._id, 'replied on ticket', req.ticket._id);
                  var myResponse = responseGenerator.generate(false,"success",200,result);
                      res.set({
                        'Content-Type': 'application/json',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).send(myResponse);
                  }
          });
              

      });
    
    
    app.use('/ticket', ticketRouter);
}