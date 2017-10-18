'use strict'
ticketApp.factory('getAllTicketService', ['$q', '$http', 'getAllDataService', function($q, $http, getAllDataService) {
    var main = this; //setting the context
    main.ticketArr = [];
    var deferred = $q.defer();
    main.ticket = 1;

    var getAllTicketData = function(ticket){

        getAllDataService.getAllTicket(ticket).then(function successCallback(response){

                  console.log(response);
                  for(var indx in response.data){
                      var tmpObject = {
                          "requestor" :  response.data[indx].requestor,
                          "subject" :  response.data[indx].subject,
                          "type" :  response.data[indx].type,
                          "status" :  response.data[indx].status,
                          "priority" :  response.data[indx].priority,
                          "agent" :  response.data[indx].agent,
                          "description" :  response.data[indx].description,
                          "createdOn" : response.data[indx].createdOn,
                          "ticketNum" : response.data[indx].ticketNum,
                          "id" : response.data[indx]._id
                      }

                      main.ticketArr.push(tmpObject);
                      if(response.headers('link')){

                        main.ticket = response.headers('link');
                        //return deferred.promise;    
                      }else{
                        main.ticket = 0;
                        //deferred.resolve(main.ticketArr);   
                      }
                      
                  }
                  return deferred.promise;  

            });
        deferred.resolve(main.ticketArr); 

    }
    
/*    var getAllTicketData  = function(){
      while(main.ticket > 0){
              getAllTicket(main.ticket);  
              
      }
      
       return (main.ticketArr);   
    }    */

    return{
       getAllTicketData: getAllTicketData
    }

}]);
