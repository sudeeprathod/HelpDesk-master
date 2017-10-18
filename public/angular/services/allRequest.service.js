'use strict'
ticketApp.factory('getAllDataService', ['$http', '$cookies', function($http, $cookies) {
    var main = this; //setting the context
    var signupUser = function(formData) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/user/signup',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
          });
    }

    var logoutUser = function() {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/user/logout',
            headers : { 'x-auth': $cookies.get('ensembleUser-auth')}
          });
    }

    var signupAdmin = function(formData) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/user/signup/admin',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
          });
    }


    var loginUser = function(formData) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/user/login',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
          });
    }

    var createTicket = function(formData) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/ticket/createticket',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded', 'x-auth': $cookies.get('ensembleUser-auth')}
          });
    }

    var createSupportTicket = function(formData){
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/support/createticket',
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded', 'x-auth': $cookies.get('ensembleUser-auth')}
          });
    }
    
    var getAllTicket = function(pageNum) {
        var datacheck = $cookies.get('ensembleUser-auth');
        console.log('AR'+JSON.stringify(datacheck));//email
        //console.log('AR'+JSON.stringify($cookies.get('ensembleUser').email));//email
        return $http({
            method: 'GET',
            //url   :  'http://localhost:3000/ticket/alltickets/check/'+pageNum,
            url   :  'http://localhost:3000/ticket/alltickets',
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }

     var getAllSupTicket = function(pageNum) {
        var datacheck = $cookies.get('ensembleUser-auth');
        return $http({
            method: 'GET',
            //url   :  'http://localhost:3000/ticket/alltickets/check/'+pageNum,
            url   :  'http://localhost:3000/support/alltickets',
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }
//http://localhost:3000/support/allacitvities/ticket/59cff52a078a1b93702d2d07/
    var getTicketDetail = function(ticketId) {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/singleticket/'+ticketId,
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }

    var getTicketActivity = function(ticketId, pageNum) {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/allacitvities/ticket/'+ticketId+'/'+pageNum,
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }


    var updateTicket = function(formData, ticketId) {
        return $http({
            method: 'PUT',
            url   :  'http://localhost:3000/ticket/update/'+ticketId,
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded', 'x-auth': $cookies.get('ensembleUser-auth')} 
          });
    }

    var replyOnTicket = function(formData, ticketId) {
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/ticket/reply/'+ticketId,
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded', 'x-auth': $cookies.get('ensembleUser-auth')} 
          });
    }

    var getAllReply = function(ticketId) {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/getallreply/'+ticketId,
            headers : {'x-auth': $cookies.get('ensembleUser-auth')} 
          });
    }

    var getAllUsers = function() {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/user/getallusers',
            headers : {'x-auth': $cookies.get('ensembleUser-auth')} 
          });
    }

    var getAllCustomers = function(){
         return $http({
            method: 'GET',
            url   :  'http://localhost:3000/user/getallcustomers',
            headers : {'x-auth': $cookies.get('ensembleUser-auth')} 
          });
    }

    var getAllAgents = function(){
         return $http({
            method: 'GET',
            url   :  'http://localhost:3000/user/getallagents',
            headers : {'x-auth': $cookies.get('ensembleUser-auth')} 
          });
    }
    
    var getAllTicketDue = function() {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/alltickets/aggregate/dueBy',
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }

    var getAllTicketStatus = function() {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/alltickets/aggregate/status',
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }

    var getAllTicketPriority = function() {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/alltickets/aggregate/priority',
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }

    var getAllTicketAssigned = function() {
        return $http({
            method: 'GET',
            url   :  'http://localhost:3000/ticket/alltickets/aggregate/agent',
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') }  
          });
    }

    var getAllActivities = function(pageNum){
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/ticket/allacitvities/'+pageNum,
            headers : { 'x-auth': $cookies.get('ensembleUser-auth') } 
        });
    }

    var getEmailCount = function(email){
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/user/check/email/'+email 
        });
    }


    var getMobileCount = function(mobile){
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/user/check/mobile/'+mobile 
        });
    }

    var deleteReply = function(ticketId, replyId){
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/ticket/delete/'+ticketId+'/reply/'+replyId,
             headers : {'x-auth': $cookies.get('ensembleUser-auth')}  
        });
    }

    var deleteTicket = function(ticketId){
        return $http({
            method: 'POST',
            url: 'http://localhost:3000/ticket/delete/'+ticketId ,

             headers : {'x-auth': $cookies.get('ensembleUser-auth')} 
        });
    }
    
    ///allacitvities/user/:userId/:pageNum
    var getUserAcitvity = function(user, pageNum){
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/ticket/allacitvities/user/'+user+'/'+pageNum,
            headers : {'x-auth': $cookies.get('ensembleUser-auth')} 
        });
    }

    var loadFile = function(formdata, ticketId){

        console.log(ticketId);
        return $http({
            method: 'POST',
            url   :  'http://localhost:3000/ticket/file/upload/'+ticketId,
            data    : formdata,  // pass in data as strings
            headers : { 'Content-Type': undefined, 'x-auth': $cookies.get('ensembleUser-auth') } 
        })
    }


    return {
        signupUser: signupUser,
        loginUser: loginUser,
        createTicket : createTicket,
        getAllTicket: getAllTicket,
        getTicketDetail : getTicketDetail,
        updateTicket: updateTicket,
        replyOnTicket: replyOnTicket,
        getAllReply: getAllReply,
        getAllUsers: getAllUsers,
        getAllTicketStatus: getAllTicketStatus,
        getAllTicketDue: getAllTicketDue,
        getAllTicketPriority: getAllTicketPriority,
        getAllTicketAssigned: getAllTicketAssigned,
        getAllActivities: getAllActivities,
        getEmailCount: getEmailCount,
        getMobileCount: getMobileCount,
        deleteReply: deleteReply,
        deleteTicket: deleteTicket,
        signupAdmin: signupAdmin,
        createSupportTicket: createSupportTicket,
        getAllSupTicket: getAllSupTicket,
        getTicketActivity: getTicketActivity,
        logoutUser: logoutUser,
        getAllCustomers: getAllCustomers,
        getAllAgents: getAllAgents,
        getUserAcitvity: getUserAcitvity,
        loadFile: loadFile
    }
}]);
