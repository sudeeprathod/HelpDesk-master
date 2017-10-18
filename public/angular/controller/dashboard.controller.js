ticketApp.controller('dashboardController', ['$http', 'getAllDataService', 'getAllTicketService', '$location', '$cookies', 'getUserData', function($http, getAllDataService, getAllTicketService, $location, $cookies, getUserData){
	  var main = this;
	  main.orightml = '';
    
    main.ticketData = {};
    main.ticketData.description = main.orightml;
    main.types = ["Question","Incident","Problem"];
    main.status = ["Open","Pending","Resolved"];
    main.priority = ["Low","Medium","Critical"];
    main.allAgents = [];
    main.fileLength = 0;
    getUserData.getAllAgents().then(function(response){
             main.userData = response;
             //console.log(main.userData);
          for(var indx in main.userData){
             //console.log(main.userData[indx]);
               main.allAgents.push(main.userData[indx].email);
          }
    });
    

    main.formInput = {};

    var formdata = new FormData();
    main.getTheFiles = function ($files) {
        main.fileLength = $files.length;
        console.log('leng'+$files.length);
        angular.forEach($files, function (value, key) {
            formdata.append(key, value);
        });
    };

    main.createTicket = function(){
        getAllDataService.createTicket(main.ticketData).then(function successCallback(response){
              if(response.data.error === true){
                 alert(response.data.message);
                  main.loginFail = true;
                  main.loginFailMsg = response.data.message;
              }else{
                  var response = response.data;
                  //console.log(response);
                  if(main.fileLength > 0){
                    //var formdata = new FormData();
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
                  }else{
                    $location.path('/dashboard/home');
                  }
                  
                  
                  //main.loginFail = false;
              }
       });
    }


    
    
    
   

}]);