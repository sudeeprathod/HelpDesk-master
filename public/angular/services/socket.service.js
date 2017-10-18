ticketApp.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback){
      socket.on(eventName, function(){
      	var args = arguments;
      	$rootScope.$applyAsync(function(){
      		callback.apply(socket, args);
      	});
      });
    },
    emit: function(eventName, data1, data2, callback) {
      //socket.emit(eventName, data);
      socket.emit(eventName, data1, data2, function(){
      	var args = arguments;
      	$rootScope.$applyAsync(function(){
      		if(callback){
      			callback.apply(socket, args);
      		}
      		
      	});
      });
    }
  };
}]);
