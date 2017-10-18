ticketApp.directive('bsTooltipTicket', function() {

    return {
        scope: {
        	labelValue: '@',
            status: '@',
            priority: '@',
            dueBy: '@'
        },
        template: `
        <div class='wrapper'>{{labelValue}}
            <div class="tooltip">
			    <p><i class="fa fa-user tooltip-icon" aria-hidden="true"></i>{{status}}</p>
			    <p><i class="fa fa-envelope tooltip-icon" aria-hidden="true"></i>{{priority}}</p>
			    <p><i class="fa fa-envelope tooltip-icon" aria-hidden="true"></i>{{dueBy}}</p>
			</div>
		
		`
    }
})