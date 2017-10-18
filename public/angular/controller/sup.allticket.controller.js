ticketApp.controller('allSupTicketController', ['$http',  'getAllDataService', 'NgTableParams', '$location', function($http, 
 getAllDataService, NgTableParams, $location){
	  var main = this;
	
    main.allTickets = [];
    main.ticket = 1;
    main.ticketArr = [];
    main.statusArr = ["ALL", "Open","Pending","Resolved", "Closed", "Progressing"];
    main.status = "ALL";
    main.priorityArr = ["ALL", "Low","Medium","Critical"];
    main.priority = "ALL";
    /*var ticket = getAllTicketService.getAllTicketData(1).then(function(result){
    	
    });*/
    var ticketFunc = function(ticket){
    getAllDataService.getAllSupTicket(ticket).then(function successCallback(response){

                  console.log(response);
                  for(var indx in response.data){
                      var tmpObject = {
                          "requestor" :  response.data[indx].requestor,
                          "subject" :  response.data[indx].subject,
                          "type" :  response.data[indx].type,
                          "status" :  response.data[indx].status,
                          "description" :  response.data[indx].description,
                          "createdOn" : response.data[indx].createdOn,
                          "ticketNum" : response.data[indx].ticketNum,
                          "id" : response.data[indx]._id,
                          "priority" :  response.data[indx].priority,
                          "agent" :  response.data[indx].agent,
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
        $location.path('/support/ticketdetail/'+id);
    }

}]);
