ticketApp.controller('allTicketController', ['$http',  'getAllDataService', 'NgTableParams', '$location', 'getUserData', function($http, 
 getAllDataService, NgTableParams, $location, getUserData){
	  var main = this;
	
    main.allTickets = [];
    main.ticket = 1;
    main.ticketArr = [];
    main.allAgents = ["ALL"];
    main.agent = "ALL";
    main.allUsers = ["ALL"];
    main.agent = "ALL";
    main.allCustomers = ["ALL"];
    main.agent = "ALL";
    main.craetedBy = ['ALL', 'ME', 'CUSTOMER', 'ADMIN'];
    main.creator = "ALL";
    main.dueByData = ['ALL', 'Today', 'Tomorrow', 'Overdue', 'ThisWeek'];
    main.dueBy = "ALL";
    main.typeData = ['ALL', 'Incident', 'Question', 'Issue'];
    main.type = "ALL";
    main.statusArr = ["ALL", "Open","Pending","Resolved", "Closed", "Progressing"];
    main.status = "ALL";
    main.priorityArr = ["ALL", "Low","Medium","Critical"];
    main.priority = "ALL";


    /*var ticket = getAllTicketService.getAllTicketData(1).then(function(result){
    	
    });*/

    getUserData.getAllAgents().then(function(response){
             main.userData = response;
             //console.log(main.userData);
          for(var indx in main.userData){
             //console.log(main.userData[indx]);
               main.allAgents.push(main.userData[indx].email);
          }
    });

    getUserData.getAllUsers().then(function(response){
             main.userData = response;
             //console.log(main.userData);
          for(var indx in main.userData){
             //console.log(main.userData[indx]);
               main.allUsers.push(main.userData[indx].email);
          }
    });

    getUserData.getAllCustomers().then(function(response){
             main.userData = response;
             //console.log(main.userData);
          for(var indx in main.userData){
             //console.log(main.userData[indx]);
               main.allCustomers.push(main.userData[indx].email);
          }
    });
    var ticketFunc = function(ticket){
    getAllDataService.getAllTicket(ticket).then(function successCallback(response){
                  //var response= response.data;
                  //console.log(response);
                  if(response.headers('link')){

                        main.ticket = response.headers('link');
                        //return deferred.promise;    
                      }else{
                        main.ticket = 0;
                        //deferred.resolve(main.ticketArr);   
                      }
                  var response = response.data;
                  for(var indx in response.data){
                      var tmpObject = {
                          "requestor" :  response.data[indx].requestor,
                          "subject" :  response.data[indx].subject,
                          "type" :  response.data[indx].type,
                          "status" :  response.data[indx].status,
                          "priority" :  response.data[indx].priority,
                          "agent" :  response.data[indx].agent,
                          "dueBy" : response.data[indx].dueBy,
                          "description" :  response.data[indx].description,
                          "createdOn" : response.data[indx].createdOn,
                          "ticketNum" : response.data[indx].ticketNum,
                          "id" : response.data[indx]._id
                      }

                     main.allTickets.push(tmpObject);
                      
                      
                  }
                  //main.allTickets = result;
			        main.ticketTable = new NgTableParams({
			        // initial sort order
			        page: 1,
			        count: 25
			        }, {
			           //console.log(main.houseArr);
			           dataset: main.allTickets
			        });

            });
        
    }(main.ticket);

    main.goToDetail = function(id){
        $location.path('/dashboard/ticketdetail/'+id);
    }
    

    console.log('ticket'+main.allTickets);

}]);