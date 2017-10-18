ticketApp.controller('ticketDetailController', ['$location','$http',  'getAllDataService', '$stateParams',  'getUserData', '$cookies', 'socket', function($location, $http, 
 getAllDataService, $stateParams, getUserData, $cookies, socket){
	var vm = this;
		vm.showReplyPanel = false;
	    vm.showAcitvity = false;
	    vm.showStatus = true;
		vm.typesData = ["Question","Incident","Problem"];
        vm.statusData = ["Open","Pending","Resolved"];
        vm.priorityData = ["Low","Medium","Critical"];
        vm.agentData = [];
        getUserData.getAllAgents().then(function(response){
             vm.userData = response;
             //console.log(vm.userData);
	        for(var indx in vm.userData){
	        	 //console.log(vm.userData[indx]);
	             vm.agentData.push(vm.userData[indx].email);
	        }
        });

        vm.activityDtl = function(){
	     // alert('hello');
	     vm.getTicketActivity(1);
	       if(vm.showAcitvity){
	          vm.showAcitvity = false;
	       }else{
	        vm.showAcitvity = true;
	       }
	       if(vm.showStatus){
	          vm.showStatus = false;
	       }else{
	        vm.showStatus = true;
	       }
     } 
        
		//vm..comment.text = $sce.trustAsHtml((vm.comment.text).toString());
	 vm.dataSaved = function () {
	 	console.log(vm.htmlcontent)
	 }
	 vm.clear = function() {
	 	alert('hiii')
	 	vm.registrForm.$setPristine(true);
	 }
	 // vm.myContent = $sce.trustAsHtml((vm.htmlcontent).toString());
	 // vm.check = $sce.trustAsHtml('<b>Hello</b>');
	 // console.log($sce.trustAsHtml(vm.htmlcontent));

	vm.sendReply = function () {
		vm.showReplyPanel = true;
	 }

	/*vm.discussionChat = function() {
		vm.showReplyPanel = false;
	}*/
	var formdata = new FormData();
		vm.getTheFiles = function ($files) {
			//alert('hello');
	        vm.fileLength = $files.length;
	        console.log('leng'+$files.length);
	        angular.forEach($files, function (value, key) {
	            formdata.append(key, value);
	        });
	    };
	
	vm.cancelReply = function() {
		vm.showReplyPanel = false;
	}
	// Current comment.
    vm.comment = {};

    // Array where comments will be.
    vm.comments = [];

    // Fires when form is submited.
    vm.addComment = function() {
      vm.showReplyPanel = false;
      // Fixed img.
      vm.comment.avatarSrc = 'http://lorempixel.com/200/200/people/';
      vm.comment.author = vm.defaultName;

      // Add current date to the comment.
      vm.comment.date = Date.now();

      //vm.comments.push( vm.comment );
      //vm.comment = {};
       

	    

      getAllDataService.replyOnTicket(vm.notes, $stateParams.ticketId).then(function successCallback(response){
               console.log(response.data.data);
               var response = response.data;
               console.log(vm.fileLength);
               if(vm.fileLength > 0){
                  getAllDataService.loadFile(formdata, response.data._id).then(function successCallback(response){
	                    if(response.data.error === true){
	                       alert(response.data.message);
	                        //main.loginFail = true;
	                        //main.loginFailMsg = response.data.message;
	                    }else{
	                        console.log(response);
	                        $location.path('/dashboard/home');
	                        //$location.path('/dashboard/home');
	                        //main.loginFail = false;
	                    };
	              });
	           }
               vm.comment = {};
               vm.comment.email = response.data.creator.email;
		   	  	vm.comment.id = response.data.creator.id;
		   	  	vm.comment.mobile = response.data.creator.mobile;
		   	  	vm.comment.userName = response.data.creator.userName;
		   	  	vm.comment.notes = response.data.notes;
		   	  	vm.comment.createdon = response.data.createdon;
		   	  	vm.comment.replyId = response.data._id;
	            vm.comments.push( vm.comment );
      });
    }

   vm.getAllReply = function(){
   	  getAllDataService.getAllReply($stateParams.ticketId).then(function successCallback(response){
   	  	vm.comments = [];
   	  	console.log(response.data);
   	  	for(var indx in response.data){
   	  		vm.comment = {};
   	  		vm.comment.replyId = response.data[indx]._id;
   	  		vm.comment.email = '';
   	  		vm.comment.id = '';
   	  		vm.comment.mobile = '';
   	  		vm.comment.userName = '';
   	  		vm.comment.notes = '';
   	  		vm.comment.createdon = '';
           if(response.data[indx].creator){
	   	  		vm.comment.email = response.data[indx].creator.email;
		   	  	vm.comment.id = response.data[indx].creator.id;
		   	  	vm.comment.mobile = response.data[indx].creator.mobile;
		   	  	vm.comment.userName = response.data[indx].creator.userName;
	   	  	}
	   	  	if(response.data[indx].notes){
	   	  		vm.comment.notes = response.data[indx].notes;
	   	  	}
	        vm.comntAtt = [];
	        vm.comment.createdon = response.data[indx].createdon;
	        for(var indx in response.data.attachment){

	          	if(response.data.attachment[indx].hasOwnProperty('filename')){
	                 vm.comntAtt.push(response.data.attachment[indx]);
	          	}
	            
	          }
	        vm.comments.push( vm.comment );
	   	}
   	  	
   	  });
   }
   

   console.log('data'+JSON.stringify($stateParams));	
   getAllDataService.getTicketDetail($stateParams.ticketId).then(function successCallback(response){
          console.log(response.data);
          var response = response.data;
   	      vm.ticket = response.data.subject + ' #' + response.data.ticketNum;
   	      vm.tickectnum = response.data.ticketNum;
   	      vm.ticketId = response.data._id;
   	      vm.type = response.data.type;
          vm.status = response.data.status;
          vm.priority = response.data.priority;
          if(response.data.hasOwnProperty('agent')){
            vm.agent = response.data.agent.email;
          }
          //response.data.ticket.priority;
          //console.log(vm.agent);
          vm.tickectId = response.data._id;


          vm.created = response.data.createdOn;
          vm.due = response.data.dueBy;

          vm.description = response.data.description;
          vm.name = response.data.requestor.userName;

          vm.email = response.data.requestor.email;

          vm.mobile = response.data.requestor.mobile;
          vm.creatorId = response.data.requestor._id;
          vm.attchment = [];
          console.log(response.data.attachment);
          for(var indx in response.data.attachment){

          	if(response.data.attachment[indx].hasOwnProperty('filename')){
                 vm.attchment.push(response.data.attachment[indx]);
          	}
            
          }
          vm.getAllReply();

   });

   vm.getTicketActivity = function(pagenum){
      getAllDataService.getTicketActivity($stateParams.ticketId, pagenum).then(function(response){
            console.log(response.data);
            vm.allAcivityData = response.data.data;
      });
   }

   

   vm.updateTicket = function(){
	   	var formData = {};
	   	formData.type = vm.type;
	   	formData.status = vm.status;
	   	formData.priority = vm.priority;
	   	formData.agent = vm.agent;
	    getAllDataService.updateTicket(formData, vm.tickectId).then(function successCallback(response){
	         console.log(response.data);
	    });
   }

   vm.deleteTicket = function(ticketId){
      getAllDataService.deleteTicket(ticketId).then(function(response){
          console.log(response);
          //if(respone.data == 'ok'){
             $location.path('/dashboard/home');
          //}

      });
   }

   

   vm.deleteReply = function(replyId){
      getAllDataService.deleteReply($stateParams.ticketId, replyId).then(function(response){
      	removeTicketReply(replyId);
          console.log(response);

      });

   }



   var removeTicketReply = function(value){
	      console.log(value);
	       for(var i =0; i<vm.comments.length; i++){
	       	  console.log(vm.comments[i]);
	          if(vm.comments[i] && vm.comments[i].hasOwnProperty('replyId') && vm.comments[i]['replyId'] === value){
	             vm.comments.splice(i, 1);
	          }
	       }
	}

	//chating 

     vm.user = $cookies.get('ensembleUser-user');
     console.log(vm.user);

     
    vm.message = [];
    vm.discussionChat2 = function() {
    	console.log(vm.user);
    	socket.emit('change room', 'A-'+vm.tickectnum, vm.user);
        //vm.isDisabled = true;
        vm.showReplyPanel = false;
        if(vm.showChat){
          vm.showChat = false;
        }else{
          vm.showChat = true;
        }
        if(vm.showStatus){
              vm.showStatus = false;
           }else{
            vm.showStatus = true;
           }
    }

    vm.customerChat = function(){
         socket.emit('change room', 'C-'+vm.tickectnum, vm.user);
          vm.showReplyPanel = false;
        if(vm.showChat){
          vm.showChat = false;
        }else{
          vm.showChat = true;
        }
        if(vm.showStatus){
              vm.showStatus = false;
           }else{
            vm.showStatus = true;
           }
    }

    vm.chatMsg = '';
    vm.chatSub = function(){
      //alert(vm.chatMsg);
      socket.emit('chat message', vm.chatMsg);
      vm.chatMsg = '';
    }
    
      /*vm.message = ["testCustomer: Hi"];
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");
      vm.message.push("testCustomer: Hi");*/
    socket.on('load old Chat', function(msg){
       vm.message = [];
      //$('#messages').html();
      //$('#messages').empty();
      console.log(msg);
      for (var indx=0; indx<msg.length; indx++) {
          var message = msg[indx].userName + ': ' + msg[indx].message;
          //$('#messages').append($('<li class="list-group-item list-group-item-info">').text(message));

          vm.message.push(message);
          //socket.emit('chat message', message);
      };
      console.log(vm.message);
    });

    socket.on('chat message', function(msg){
        //$('#messages').append($('<li class="list-group-item list-group-item-info">').text(msg));
        //alert('Hello');
       
        vm.message.push(msg);
        console.log(vm.message);

        //$('#messages').append($('<li>').text(msg));
        
    });
	//chat
   

}]);
