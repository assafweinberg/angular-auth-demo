//Application routes for login page and app
angular.module('demoApp', ['ui.router'])
  .config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true)

    $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: '/templates/login.html',
          controller: 'loginCtrl',
        })
        .state('app', {
          url: '/',
          templateUrl: 'templates/app.html',
          controller: 'appCtrl',
          resolve: { authenticate: authenticate }
        })
  })

//Authentication function
function authenticate($q, $state, $timeout, AuthService) {
  // return $q.when()
  if (AuthService.isAuthenticated()) {
    // Resolve the promise successfully
    return $q.when()
  } else {
    $timeout(function() {
      // This code runs after the authentication promise has been rejected.
      // Go to the log-in page
      $state.go('login')
    })

    // Reject the authentication promise to prevent the state from loading
    return $q.reject()
  }
}