'use strict'
ticketApp.factory('getAllActivityService', ['$http', 'getAllDataService', function($http, getAllDataService) {
    var main = this; //setting the context
    main.ticketArr = [];
    var getAllTicketData = function(){
        getAllDataService.getAllTicket(1).then(function successCallback(response){

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
                  }

                  console.log(response);
                  console.log(JSON.stringify(response.headers('link')));
                  

            });
        return main.ticketArr;

    }
            

    return{
       getAllTicketData: getAllTicketData
    }

}]);
