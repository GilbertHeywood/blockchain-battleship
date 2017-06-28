appInit.$inject = [];
export function appInit(){
  console.log("This worked");
};

routing.$inject = ['$urlRouterProvider', '$locationProvider'];
export function routing($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  // Need to check here the url that was found
  $urlRouterProvider.otherwise(function($injector){
    let $state = $injector.get('$state');
    
    $state.go('home-error',{ code: 404 });
  });
}