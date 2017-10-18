var mongoose = require('mongoose'); 

var onlineUsers = [];
var onlineAdmin = [];
var express = require('express');

var chatRouter = express.Router();

module.exports.controllerFunction = function(app, io){
    //var http = require('http').Server(app);
    //app.use(express.static(path.resolve(__dirname,'./../public')));
   //chatRouter.get('/', function(req, res){
             var events = require('events');
    var eventEmitter = new events.EventEmitter();

    var allChat    = mongoose.model('Chat'); 
    var userRoom = 'user';
    var adminRoom = 'admin';

    eventEmitter.on('saveChat', function(data, user, room){
        console.log('emit:-'+data+' :-'+user);
        var newChat = new allChat({
          userName      : user,
        group         : room,
        message       : data,
        createdOn           : new Date()
        });
        newChat.save(function(err){
          if(err){
               console.log('some error occured'+err);
          }else{
               console.log('chat saved');
          }
        });
    });

    

    eventEmitter.on('savedChat', function(user, room, id){
      allChat.find({'group': room}, function(err, result){
             if(err){
              //console.log('err'+err);
                res.send('some error had occured');
             }else{
              //io.emit('load old Chat', result);
              //console.log('result'+result);
              eventEmitter.emit('genearte old chat', result, room, user, id);
             }
          });
    });   


    io.on('connection', function(socket){
      //console.log('a user connected');
      eventEmitter.on('genearte old chat', function(result, room, user, id){
         socket.to(id).emit('load old Chat', result);
        console.log('socket.id'+socket.id);
        console.log('id'+id);
         
      });

      var checkOnlineUsers = function(onlineUsers){
          io.emit('online users', onlineUsers);
      }

      socket.on('user',function(user){
        console.log(user+ "came online");
        socket.join('user');

        //emit event to set default broadcast room for the user
        socket.user = user;
        socket.room = userRoom;
        onlineUsers.push(socket.user);
        checkOnlineUsers(onlineUsers);
        //eventEmitter.emit('savedChat', socket.user, socket.room, socket.id);
        //socket.broadcast.to('broadcast').emit('chat message', data+" came online");
        //io.in(socket.room).emit('privateRoom', socket);

      });

      socket.on('admin',function(user){
        console.log(user+ "came online");
        socket.join('admin');

        //emit event to set default broadcast room for the user
        socket.user = user;
        socket.room = adminRoom;
        onlineAdmin.push(socket.user);
        checkOnlineUsers(onlineAdmin);
        //eventEmitter.emit('savedChat', socket.user, socket.room, socket.id);
        socket.broadcast.to(adminRoom).emit('notify', user+" came online");
        //io.in(socket.room).emit('privateRoom', socket);

      });

      socket.on('chat message', function(msg){
        io.to(socket.room).emit('chat message', socket.user+' : '+msg);
        eventEmitter.emit('saveChat', msg, socket.user, socket.room);

      });

      socket.on('change room', function(room, user){
        console.log(room);

        console.log(user);
        socket.leave(socket.room);
        socket.room = room;   
        socket.user = user;     
        socket.join(socket.room);
        eventEmitter.emit('savedChat', socket.user, socket.room, socket.id);
      });

      socket.on('logout', function(){
         console.log("disconnect");
         socket.emit('disconnect');
      });

      socket.on('disconnect',function(){
         console.log("disconnect");
         
         if(socket.user){
          console.log("some user left the chat");
          socket.broadcast.to('broadcast').emit('chat message', socket.user+" left the chat");
          console.log(socket.user);
          onlineUsers.splice(onlineUsers.indexOf(socket.user), 1);
            checkOnlineUsers(onlineUsers);
         }
         
      }); //end socket disconnected
      
      socket.on('message', function(msg){
        io.to(socket.room).emit('message', msg);

      });

      socket.on('typing', function(data) {
         if(!data){
            socket.to(socket.room).broadcast.emit('message', '');
         }else{
          socket.to(socket.room).broadcast.emit('message', socket.user+" is typing..");
         } 
      });

      socket.on('privateChat', function(item, user){
         var room;
         if(!item || !user){
             room = 'broadcast';
         }else{
          var user1 = item.toLowerCase();
          var user2 = user.toLowerCase();
          var name;
          if(user1<user2){
              name = user1+user2; 
          }else{
            name = user2 + user1;
          }
          room = name;
         }
         socket.leave(socket.room);
         socket.room = room;     
         socket.join(socket.room);
         console.log(socket.room);
         console.log(socket.user);
         eventEmitter.emit('savedChat', socket.user, socket.room, socket.id);
         //console.log(socket);
         //io.in(socket.room).emit('privateRoom', socket);

         //io.emit('privateRoom', 'this is private chat room');
         //console.log(item+user);
         //eventEmitter.emit('checkUser', item, user);
      });

    });

   //})

}