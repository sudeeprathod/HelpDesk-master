ticketApp.directive('bsTooltip', function() {

    return {

        scope: {

        	labelValue: '@',
            name: '@',
            email: '@',
            mobile: '@'
        },
        transclude: true,
        template: `
        <div class='wrapper'>{{labelValue}}<ng-transclude></ng-transclude>
            <div class="tooltip">
                
				    <p><i class="fa fa-user tooltip-icon" aria-hidden="true"></i>{{name}}</p>
				    <p><i class="fa fa-envelope tooltip-icon" aria-hidden="true"></i>{{email}}</p>
				    <p><i class="fa fa-envelope tooltip-icon" aria-hidden="true"></i>{{mobile}}</p>
			    
			</div>
		
		`
    }
})