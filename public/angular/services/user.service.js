ticketApp.factory('getUserData', ['$http', '$q', 'getAllDataService', function($http, $q, getAllDataService) {
    var vm= this;
    var currentUser = {};
    vm.allUsers = [];
    vm.allCustomers = [];
    vm.allAgents = [];
    var deferred = $q.defer();
    var getUser = function(){
           return currentUser;
    };
    var setUser = function(email, userName){

         currentUser = {
            email: email,
            userName: userName
         };
    }

    var getAllUsers = function(){
        getAllDataService.getAllUsers().then(function(response){
            
            for(var data in response.data){
               //console.log(response.data[data]);
               vm.allUsers.push(response.data[data]);
            }
            deferred.resolve(vm.allUsers);
        });
        return deferred.promise;
    }

    var getAllCustomers = function(){
        getAllDataService.getAllCustomers().then(function(response){
            
            for(var data in response.data){
               //console.log(response.data[data]);
               vm.allCustomers.push(response.data[data]);
            }
            deferred.resolve(vm.allCustomers);
        });
        return deferred.promise;
    }

    var getAllAgents = function(){
        getAllDataService.getAllAgents().then(function(response){
            
            for(var data in response.data){
               //console.log(response.data[data]);
               vm.allAgents.push(response.data[data]);
            }
            deferred.resolve(vm.allAgents);
        });
        return deferred.promise;
    }

    return{
    	getUser: getUser,
        setUser: setUser,
        getAllUsers: getAllUsers,
        getAllCustomers: getAllCustomers,
        getAllAgents: getAllAgents
    }

   
    

}]);