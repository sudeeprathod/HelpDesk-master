ticketApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,  $urlRouterProvider){
    

    //$urlRouterProvider.otherwise('/home');

    $stateProvider
     .state('home', {
        url: '/home',
        //template: 'hello'
        templateUrl     : 'views/landingPage.html',
        controller      : 'indexController',
        // what is the alias of that controller.
        controllerAs    : 'index'

     })

     .state('signup', {
        url: '/signup',

        templateUrl     : 'views/signup.html',
        controller      : 'mainController',
        // what is the alias of that controller.
        controllerAs    : 'main'

     })

     .state('signupadmin', {
        url: '/signup/admin',

        templateUrl     : 'views/signupadmin.html',
        controller      : 'mainController',
        // what is the alias of that controller.
        controllerAs    : 'main'

     })

     .state('login', {
        url: '/login',

        templateUrl     : 'views/login.html',
        controller      : 'mainController',
        // what is the alias of that controller.
        controllerAs    : 'main'
     })

     .state('dashboard',{
        abstract: true,
        url: '/dashboard',
        templateUrl     : 'views/dashboard.html',
        controller      : 'dashboardController',
        controllerAs    : 'dashboard'
     })
     
     .state('dashboard.profile',{

        url: '/profile',
        templateUrl     : 'views/userdetail.view.html',
        controller      : 'userDetail',
        controllerAs    : 'main'
     })

     .state('dashboard.home',{

        url: '/home',
        templateUrl     : 'views/dashboardhome.html',
        controller      : 'allTicketController',
        controllerAs    : 'dashboard'
     })

     .state('dashboard.newticket',{

        url: '/newticket',
        templateUrl     : 'views/createticket.html',
        controller      : 'dashboardController',
        controllerAs    : 'dashboard'
     })

     .state('dashboard.ticketdetail',{

        url: '/ticketdetail/:ticketId',
        templateUrl     : 'views/ticketdetail.html',
        controller      : 'ticketDetailController',
        controllerAs    : 'detailCntrl'
     })

      .state('dashboard.main',{

        url: '/main',
        templateUrl     : 'views/dashboardmain.html',
        controller      : 'mainDashboard',
        controllerAs    : 'main'
     })

       .state('support',{
             abstract: true,
            url: '/support',
            templateUrl     : 'views/support.html',
            controller      : 'supportController',
            controllerAs    : 'support'
         })

       .state('support.home',{

            url: '/home',
            templateUrl     : 'views/supporthome.html',
            controller      : 'allSupTicketController',
            controllerAs    : 'support'
        })

       .state('support.newticket',{

            url: '/newticket',
            templateUrl     : 'views/supticket.html',
            controller      : 'supportController',
            controllerAs    : 'support'
        })

       .state('support.ticketdetail',{

            url: '/ticketdetail/:ticketId',
            templateUrl     : 'views/support.ticketdetail.html',
            controller      : 'supTicketDetailController',
            controllerAs    : 'detailCntrl'
         })
    /*$stateProvider
        .when('/',{
            // location of the template
        	templateUrl		: 'views/landingPage.html',
        	// Which controller it should use 
            controller 		: 'mainController',
            // what is the alias of that controller.
        	controllerAs 	: 'main'
        })
		

        .otherwise(
            {
                //redirectTo:'/'
                template   : '<h1>404 page not found</h1>'
            }
        );*/
        /*$locationProvider.html5Mode({
             enabled: true,
            requireBase: false
        });*/
}]);