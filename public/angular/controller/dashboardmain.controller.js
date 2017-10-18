ticketApp.controller('mainDashboard', ['$http',  'getAllDataService', function($http, 
 getAllDataService){
	var main = this;
    main.allTickets = [];
    main.overdue = 0;
    main.duetoday = 0;
    main.pending = 0;
    main.resolved = 0;
    main.open = 0;
    main.critical = 0;
    main.medium = 0;
    main.low = 0;
    main.unassigned = 0;
    main.agentData = {};
    main.allAgentData = [];
    main.pageNum = 1;

    getAllDataService.getAllTicketStatus().then(function(response){
    	var response= response.data;
    	for(var indx in response.data){
           if(response.data[indx]._id === 'Pending'){
	           main.pending = response.data[indx].count;
	    	}
	    	if(response.data[indx]._id === 'Resolved'){
	           main.resolved = response.data[indx].count;
	    	}
	    	if(response.data[indx]._id === 'Open'){
	           main.open = response.data[indx].count;
	    	}
    	}
    });

    getAllDataService.getAllTicketPriority().then(function(response){
    	var response= response.data;
    	for(var indx in response.data){
           if(response.data[indx]._id === 'Critical'){
	           main.critical = response.data[indx].count;
	    	}
	    	if(response.data[indx]._id === 'Medium'){
	           main.medium = response.data[indx].count;
	    	}
	    	if(response.data[indx]._id === 'Low'){
	           main.low = response.data[indx].count;
	    	}
    	}
    });


    getAllDataService.getAllTicketAssigned().then(function(response){
    	var response= response.data;
    	for(var indx in response.data){
           if(response.data[indx]._id == null){
	           main.unassigned = response.data[indx].count;
	    	}else if(response.data[indx]._id.userName){
                    main.allAgentData.push({
                    	userName: response.data[indx]._id.userName,
                    	count: response.data[indx].count
                    });
	    	}
    	}
    	console.log(main.allAgentData);
    });

    getAllDataService.getAllTicketDue().then(function(response){
    	var response= response.data;
    	var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		} 
		if(mm<10){
		    mm='0'+mm;
		} 
		var today = yyyy+'-'+mm+'-'+dd;
		console.log(response);
		console.log(today);
		for(var indx in response.data){
			console.log(new Date(response.data[indx]._id.dueBy));
           if(Date.parse(response.data[indx]._id.dueBy) > Date.parse(today)){
	           main.overdue = response.data[indx].count;
	    	}
	    	if(Date.parse(response.data[indx]._id.dueBy) === Date.parse(today)){
	           main.duetoday = response.data[indx].count;
	    	}
    	}
    });

    main.getActivities = function (pageNum){
        getAllDataService.getAllActivities(pageNum).then(function(response){

        	var response= response.data;
            main.allAcivityData = response.data;
        });

    }
    main.getActivities();

    
    
}]);