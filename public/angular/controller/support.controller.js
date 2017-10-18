ticketApp.controller('supportController', ['$http', 'getAllDataService', 'getAllTicketService', '$location', '$cookies', 'getUserData', function($http, getAllDataService, getAllTicketService, $location, $cookies, getUserData){
	  var main = this;
	  main.orightml = '';
    
    main.ticketData = {};
    main.ticketData.description = main.orightml;
    main.types = ["Question","Incident","Problem"];
    main.status = ["Open","Pending","Resolved"];
    main.priority = ["Low","Medium","Critical"];
    main.allAgents = [];
    main.fileLength = 0;
    

    main.formInput = {};

    main.createTicket = function(){
        getAllDataService.createSupportTicket(main.ticketData).then(function successCallback(response){
              if(response.data.error === true){
                 alert(response.data.message);
                  main.loginFail = true;
                  main.loginFailMsg = response.data.message;
              }else{
                  console.log(response);
                  if(main.fileLength > 0){
                     main.loadFile(response.data._id).then(function successCallback(response){
                            if(response.data.error === true){
                               alert(response.data.message);
                                //main.loginFail = true;
                                //main.loginFailMsg = response.data.message;
                            }else{
                                console.log(response);
                                $location.path('/support/home');
                                //$location.path('/dashboard/home');
                                //main.loginFail = false;
                            };
                      });
                  }else{
                    $location.path('/support/home');
                  }
                  
                  
                  //main.loginFail = false;
              }
       });
    }


    var formdata = new FormData();
    main.getTheFiles = function ($files) {
        main.fileLength = $files.length;
        console.log('leng'+$files.length);
        angular.forEach($files, function (value, key) {
            formdata.append(key, value);
        });
    };
    
    main.loadFile = function(ticketId){

      console.log(ticketId);
      return $http({
          method: 'POST',
          url   :  'http://localhost:3000/ticket/file/upload/'+ticketId,
          data    : formdata,  // pass in data as strings
          headers : { 'Content-Type': undefined, 'x-auth': $cookies.get('ensembleUser-auth') } 
      })
  }
   

}]);