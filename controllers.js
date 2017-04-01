//Basic page controllers for login and application
angular.module('demoApp')
  .controller('appCtrl', function($scope, $state, AuthService){
    $scope.logout = function(){
      AuthService.logout()
      $state.go('login')
    }
  })
  .controller('loginCtrl', function($scope, $state, $q, AuthService){
    $scope.credentials = {
      username: '',
      password: ''
    }
    $scope.login = function(){
      AuthService.login($scope.credentials)
        .then(function(){
         $state.go('app') 
        })
        .catch(function(err){
          console.log('error logging in', err) 
        })
    }
  })