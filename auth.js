var poolData = {
      UserPoolId : 'us-west-2_EEVTNRU45', // Your user pool id here
      ClientId : '4ei4qmqdiis0jvcj450kbt7ga1' // Your client id here
    }

var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);



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
      
      //Cognito stuff
      var authenticationData = {
          Username : credentials.username,
          Password : credentials.password
      }
        
      var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
      var userData = {
        Username : credentials.username,
        Pool : userPool
      };
      var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

      //Promisify the congnito API
      return new Promise(function(resolve,reject){
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : poolData.UserPoolId, // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.us-west-2.amazonaws.com/us-west-2_EEVTNRU45' : result.getIdToken().getJwtToken()
                }
            });
            //save access token
            Session.create(credentials.username)
            resolve(credentials.username)
        },

        onFailure: function(err) {
            reject(err);
        },
      }); 
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

