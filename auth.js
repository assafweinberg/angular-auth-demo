//Create some session provider to abstract where you store user session
angular.module('demoApp')
  .factory('Session', function () {
    var session = {}
   
    session.create = function(userId) {
      sessionStorage.setItem('userId', userId)
    }

    session.destroy = function() {
      sessionStorage.removeItem('userId')
    }

    session.getUserId = function(){
      return sessionStorage.getItem('userId')
    }
   
    return session
  })
  .factory('AuthService', function ($http, $q, Session) {
    var authService = {}
   
    authService.login = function (credentials) {
      
      //Just a mock for now. This is where you make an http call to your auth service
      return new Promise(function(resolve,reject){
        Session.create(credentials.username)
        resolve(credentials.username)
      })
    }
   
    authService.isAuthenticated = function () {
      return !!Session.getUserId()
    };

    authService.logout = function () {
      Session.destroy()
    };
   
    return authService;
  })

