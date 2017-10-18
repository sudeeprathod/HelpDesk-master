ticketApp.controller('mainController', ['$http', '$state', 'getAllDataService', '$location', '$cookies', 'getUserData', 'socket', '$scope', function($http, $state, getAllDataService, $location, $cookies, getUserData, socket, $scope){
	  var main = this;
	  main.formData = {};
    main.adminData = {};
	  main.loginData = {};
    main.showLogin = true;
    main.loginFail = false;
    main.loginFailMsg = '';
    main.dupemail = false;
    main.dupmobile = false;

      /*$http.get('http://localhost:3000/user/signup')
           .then(function(response){
              main.data = response;
       });*/
      main.clearEmailSpan = function(){
          main.dupemail  = false;
      }

      main.checkEmail = function(){

         getAllDataService.getEmailCount(main.formData.email).then(function(response){
             if(response.data.result > 0){
                main.dupemail  = true;
             }
         });
      }

      main.clearMobileSpan = function(){
          main.dupmobile = false;
      }

      main.checkMobile = function(){

         getAllDataService.getMobileCount(main.formData.mobile).then(function(response){
             if(response.data.result > 0){
                main.dupmobile = true;
             }
         });
      }

       main.signUp = function(){
           getAllDataService.signupUser(main.formData).then(function successCallback(response){
                  $cookies.put('ensembleUser-auth', response.headers('x-auth'));
                  getUserData.setUser(response.data.email, response.data.userName);
                  $location.path('/dashboard/home');
                  main.loginFail = false;
                  $location.path('/support/home');
           });
       }

       main.signupAdmin = function(){
           getAllDataService.signupAdmin(main.adminData).then(function successCallback(response){
                  console.log(response);
                  $cookies.put('ensembleUser-auth', response.headers('x-auth'));
                  getUserData.setUser(response.data.email, response.data.userName);
                 
                  $location.path('/dashboard/home');
                   main.loginFail = false;
                  $cookies.put('ensembleUser-auth', response.headers('x-auth'));
                  
                  $cookies.put('ensembleUser-email', response.data.email);
                  $cookies.put('ensembleUser-user', response.data.userName);
                  $cookies.put('ensembleUser-username', response.data.userName);
                  if(response.headers('x-admin')){
                    $cookies.put('ensembleUser-admin', response.headers('x-admin'));
                    socket.emit('admin', response.data.userName, response.headers('x-admin'));
                    $scope.$parent.index.user.user = response.data.userName;
                    getUserData.setUser(response.data.email, response.data.userName);
                    $location.path('/dashboard/home');
                    main.loginFail = false;
                  }else{
                     socket.emit('user', response.data.userName);
                     $scope.$parent.index.user.user = response.data.userName;
                     $location.path('/support/home');
                     main.loginFail = false;
                  }
           });
       }

       main.login = function(){
           console.log($scope.$parent.index.showLogin);
           $scope.$parent.index.showLogin = false;
           $scope.$parent.index.showUser = true;

           getAllDataService.loginUser(main.loginData).then(function successCallback(response){
                  if(response.data.error === true){
                     alert(response.data.message);
                      main.loginFail = true;
                      main.loginFailMsg = response.data.message;
                  }else{
                      console.log(response);
                      var userObject = {};
                      userObject.userName = response.data.userName;
                      userObject.id = response.data._id;
                      userObject.email = response.data.email;
                      userObject.mobile = response.data.mobileNumber;
                      userObject.auth = response.headers('x-auth');
                      var mainObject = {
                        currentUser: {
                          userName : response.data.userName,
                          id : response.data._id,
                          email : response.data.email,
                          mobile : response.data.mobileNumber,
                          auth : response.headers('x-auth')
                        }
                      }
                      $cookies.put('ensembleUser-auth', response.headers('x-auth'));
                      
                      $cookies.put('ensembleUser-email', response.data.email);
                      $cookies.put('ensembleUser-user', response.data.userName);
                      $cookies.put('ensembleUser-username', response.data.userName);
                      if(response.headers('x-admin')){
                        $cookies.put('ensembleUser-admin', response.headers('x-admin'));
                        socket.emit('admin', response.data.userName, response.headers('x-admin'));
                        $scope.$parent.index.user.user = response.data.userName;
                        getUserData.setUser(response.data.email, response.data.userName);
                        $location.path('/dashboard/home');
                        main.loginFail = false;
                      }else{
                         socket.emit('user', response.data.userName);
                         $scope.$parent.index.user.user = response.data.userName;
                         $location.path('/support/home');
                         main.loginFail = false;
                      }
                      
                      
                  }
                  
           });
       }

}]);