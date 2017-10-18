ticketApp.controller('indexController', ['getAllDataService', '$cookies', '$location', 'getUserData', function(getAllDataService, 
 $cookies, $location, getUserData){
	var main = this;

	main.showLogin = true;
	main.showUser = false;
	main.user = {};
	var checkUser = function(){
		if($cookies.get('ensembleUser-auth')){
			main.showLogin = false;
		    main.showUser = true;
		}
		if($cookies.get('ensembleUser-email')){
			
			main.user.email = $cookies.get('ensembleUser-email');
			main.showLogin = false;
		    main.showUser = true;
		}
		if($cookies.get('ensembleUser-user')){
			
			main.user.user = $cookies.get('ensembleUser-user');
			main.showLogin = false;
		    main.showUser = true;
		}
	}
	checkUser();
    //getUserData.setUser(main.showLogin, main.showUser);
	/*main.checkLogin = function(main.showLogin, main.showUser){
         getUserData.setUser(main.showLogin, main.showUser){

         }
	}*/

	main.logoutUser = function(){
		//alert('Log Out');	
		getAllDataService.logoutUser().then(function(response){
            console.log(response);
            //alert('Logedd Out');
            $cookies.remove('ensembleUser-auth');
            $cookies.remove('ensembleUser-email');
            $cookies.remove('ensembleUser-user');
            $cookies.remove('ensembleUser-admin');
            $cookies.remove('ensembleUser-username');
            $location.path('/home');
            main.showLogin = true;
	        main.showUser = false;
	        socket.emit('logout');
		});
	}
}]);