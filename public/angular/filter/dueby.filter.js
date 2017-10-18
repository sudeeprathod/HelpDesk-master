ticketApp.filter("creator", function(){
   return function(items, data){
   	    var arr = [];
   	    for(var indx in items){
              if(data != items[indx].requestor.userName){
                 items.splice(indx, 1);
              }else{
              	arr.push(items[indx]);
              }
        }
           return arr;    
   }

});


ticketApp.filter("agent", function(){
   return function(items, data){
   	    var arr = [];
   	    for(var indx in items){
              if(data != items[indx].agent.userName){
                 items.splice(indx, 1);
              }else{
              	
              	arr.push(items[indx]);
              	
              }
        }
           return arr;    
   }

});