var app = angular.module('myApp', []);

app.controller('myCtrl',function($scope, $interval, $http) {

        $scope.baseIncrement = ["1"];
        $scope.viewers = ["0"];
        $scope.followers = ["0"];
        $scope.subscribers = ["0"];

        $scope.number = ["0"];
        $scope.displayNumber = "0";

        $scope.accessToken = '';
        

        $scope.pullFromTwitch = function() {
            var userName = 'TwitchMakesABigNumber';
            var userId = '452018475';
            var clientId = 'eo171si6zugwlanaf2it4wuo3mg6y7';
            var clientSecret = '1u9f21tz495eg388gu7ads9rok69nl'            
            var headers = {'client-id':'eo171si6zugwlanaf2it4wuo3mg6y7',
                           'Authorization':'Bearer' + accessToken};
            console.log("pullFromTwitch");
            
            //get oath token
            $http.post("https://" + userName + ".twitch.tv/oauth2/token?client_id=" + userId + "&client_secret=" + clientSecret + "&grant_type=client_credentials")
                .then(function success(response) {
                    debugger;
                    $scope.accessToken = response.data.access_token;
                }, function error(response) {
                    debugger;
                });
            
            //get viewers
            $http.get("https://api.twitch.tv/helix/streams?user_id=" + userId, {
                headers: headers
            }).then(function success(response) {
                if (response.data.data.length == 0) {
                    $scope.viewers = ["0"];
                } else {
                    $scope.viewers = ["" + response.data.data[0].viewer_count.toString() + ""]
                }
            }, function error(response) {
                alert('something broke');
                debugger;
            });

            //followers
            $http.get("https://api.twitch.tv/helix/users/follows?to_id=" + userId, {
                headers: headers
            }).then(function success(response) {
                $scope.followers = ["" + response.data.total + ""];
            }, function error(response) {
                alert('uh-oh');
                debugger;
            });

            //subscribers
            $http.get("https://api.twitch.tv/helix/subscriptions?broadcaster_id=" + userId + "&user_id=" + userId, {
                headers: headers
            }).then(function success(response) {
                debugger;
            }, function error(response) {
                alert("now you've done it");
                debugger;
            });
        }

        $scope.calculateIncrement = function() {   
            var inc = $scope.baseIncrement;

            if ($scope.viewers > 0) {
                inc = bigMultiply($scope.baseIncrement, $scope.viewers)
            }                         
            
            if ($scope.followers > 0) {
                inc = bigMultiply(inc, $scope.followers);
            }  
            
            if ($scope.subscribers > 0) {
                inc = bigExponent(inc, $scope.subscribers);
            }
            
            return inc;            
        }        

        $scope.incrementNumber = function() {
            $scope.number = bigAdd($scope.number, $scope.calculateIncrement());
            $scope.displayNumber = getBigNumberAsString($scope.number);
            console.log("Add " + $scope.getIncrementAsString());
        }

        $scope.getIncrementAsString = function() {
            return getBigNumberAsString($scope.calculateIncrement());
        }
        $scope.getViewersAsString = function() {
            return getBigNumberAsString($scope.viewers);
        }
        $scope.getFollowersAsString = function() {
            return getBigNumberAsString($scope.followers);
        }
        $scope.getSubscribersAsString = function() {
            return getBigNumberAsString($scope.subscribers);
        }

        
        $interval($scope.pullFromTwitch, 5000);   
        $interval($scope.incrementNumber, 1000);  

        $scope.pullFromTwitch();

});