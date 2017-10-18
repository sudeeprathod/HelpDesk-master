var mongoose = require('mongoose');
var express = require('express');

var userRouter = express.Router();
var userModel = mongoose.model('User');
var responseGenerator = require('./../../library/responseGenerator');
var authenticate = require('./../../middlewares/authenticate');

module.exports.controllerFunction = function(app){
     
     userRouter.get('/check/email/:email', function(req, res){
          userModel.find({'email': req.params.email}).count().exec(function(err, result){
            res.send({'result': result});
          });
     });

     userRouter.get('/check/mobile/:mobile', function(req, res){
          userModel.find({'mobileNumber': req.params.mobile}).count().exec(function(err, result){
            res.send({'result': result});
          });
     });

      userRouter.get('/check/username/:user', function(req, res){
          userModel.find({'userName': req.params.user}).count().exec(function(err, result){
            res.send({'result': result});
          });
     });

     userRouter.get('/getallusers',  authenticate.authenticate, function(req, res){
         userModel.find({}, function(err, result){
              if(err){
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(404).send(err);
              }else{
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(200).send(result);
              }
         });
     });

     userRouter.get('/getallcustomers',  authenticate.authenticate, function(req, res){
         userModel.find({'admin': 'N'}, function(err, result){
              if(err){
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(404).send(err);
              }else{
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(200).send(result);
              }
         });
     });

     userRouter.get('/getallagents',  authenticate.authenticate, function(req, res){
         userModel.find({'admin': 'Y'}, function(err, result){
              if(err){
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(404).send(err);
              }else{
                 res.set({
                        'Content-Type': 'text/plain',
                        'Content-Length': '123',
                        'ETag': '12345',
                        'Access-Control-Allow-Origin': '*'
                      }).status(200).send(result);
              }
         });
     });

     userRouter.post('/login',  function(req, res){
        userModel.findByCredentials(req.body.email, req.body.psw).then(function(result){
             return result.generateAuthToken().then(function(token){
                console.log(token);
                if(result.admin === 'Y'){
                    res.set({
                      'Content-Type': 'text/plain',
                      'Content-Length': '123',
                      'ETag': '12345',
                      'Access-Control-Allow-Origin': '*',
                      'x-auth': token,
                      'x-admin': token
                    }).send(result);
                }else{
                   res.set({
                      'Content-Type': 'text/plain',
                      'Content-Length': '123',
                      'ETag': '12345',
                      'Access-Control-Allow-Origin': '*',
                      'x-auth': token
                    }).send(result);
                }
                
             })
        }).catch(function(e){
                console.log('e'+e);
                res.status(400).send();
        });
    });
		
    userRouter.post('/logout', authenticate.authenticate, function(req, res){
       
        userModel.findOneAndUpdate({'_id': req.user._id}, {$pull: {'tokens': {'token':req.token}}}, {multi: true},function(req, result){
            console.log(result);
            res.send({result: result});
        });
    });

     userRouter.post('/signup', function(req, res){
          console.log(JSON.stringify(req.body));
          if(!req.body.fname || !req.body.lname || !req.body.email || !req.body.mobile || !req.body.psw){

          }
          var newUser = new userModel({
                userName            : req.body.fname+''+req.body.lname,
                firstName           : req.body.fname,
                lastName            : req.body.lname,
                email               : req.body.email,
                mobileNumber        : req.body.mobile,
                password            : req.body.psw,
                admin               : 'N'
            });
          //newUser.save().then();
          newUser.save(function(err, result){
                if(err){

                   //var myResponse = responseGenerator.generate(true,err,500,null);

                   console.log(err);
                   res.set({
              					  'Content-Type': 'text/plain',
              					  'Content-Length': '123',
              					  'ETag': '12345',
              					  'Access-Control-Allow-Origin': '*'
              					}).send(err);                
                }
                else{
                    newUser.generateAuthToken().then(function(token){
                         /*req.session.user = newUser;
                          delete req.session.user.password;
                          res.redirect('/user/dashboard');
  */                      //newUser.generateAuthToken();
                          res.set({
                                    'Content-Type': 'text/plain',
                                    'Content-Length': '123',
                                    'ETag': '12345',
                                    'Access-Control-Allow-Origin': '*',
                                    'x-auth': token
                                  }).send(result);
                          //res.send('ok');
                    });
                   
                }

            });//end new user save

     });


     userRouter.post('/signup/admin', authenticate.validateAdminKey, function(req, res){
          console.log(JSON.stringify(req.body));
          var newUser = new userModel({
                userName            : req.body.fname+''+req.body.lname,
                firstName           : req.body.fname,
                lastName            : req.body.lname,
                email               : req.body.email,
                mobileNumber        : req.body.mobile,
                password            : req.body.psw,
                admin               : 'Y'
            });
          //newUser.save().then();
          newUser.save(function(err, result){
                if(err){

                   //var myResponse = responseGenerator.generate(true,err,500,null);

                   console.log(err);
                   res.set({
                          'Content-Type': 'text/plain',
                          'Content-Length': '123',
                          'ETag': '12345',
                          'Access-Control-Allow-Origin': '*'
                        }).send(err);                
                }
                else{
                    newUser.generateAuthToken().then(function(token){
                         /*req.session.user = newUser;
                          delete req.session.user.password;
                          res.redirect('/user/dashboard');
  */                      //newUser.generateAuthToken();
                          res.set({
                                    'Content-Type': 'text/plain',
                                    'Content-Length': '123',
                                    'ETag': '12345',
                                    'Access-Control-Allow-Origin': '*',
                                    'x-auth': token,
                                    'x-admin': token
                                  }).send(result);
                          //res.send('ok');
                    });
                   
                }

            });//end new user save

     });


     app.use('/user', userRouter);
}