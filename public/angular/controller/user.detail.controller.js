ticketApp.controller('userDetail', ['getAllDataService', '$cookies', '$location', function(getAllDataService, 
 $cookies, $location){
	var main = this;

	main.showLogin = true;
	main.showUser = false;
	main.user = {};

	//main.allUserAcitvity = [];
	
	main.getUserAcitvity = function(user, pagenum){
		getAllDataService.getUserAcitvity(user, pagenum).then(function(response){
            main.allUserAcitvity = response.data.data;
		});
		
	};

	main.getUserAcitvity($cookies.get('ensembleUser-user'), 1);

}]);