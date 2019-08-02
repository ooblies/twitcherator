var app = angular.module('myApp', []);

app.controller('myCtrl',function($scope, $interval, $http, $timeout) {

        $scope.baseIncrement = ["1"];
        $scope.viewers = ["0"];
        $scope.followers = ["0"];
        $scope.subscribers = ["0"];

        $scope.number = ["0"];
        $scope.displayNumber = "0";        

        $scope.floaterCount = 0;

        $scope.delayInMS = 1000;

        $scope.pullFromTwitch = function() {
            var userName = 'TwitchMakesABigNumber';
            var userId = '452018475';
            var clientId = 'eo171si6zugwlanaf2it4wuo3mg6y7';
            var clientSecret = '1u9f21tz495eg388gu7ads9rok69nl'     
            
            //get oath token
            $http.post("https://id.twitch.tv/oauth2/token?client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=client_credentials&scope=channel:read:subscriptions")
                .then(function success(response) {
                    //get subscriber count
                    $http.get("https://api.twitch.tv/helix/subscriptions?broadcaster_id=" + userId + "&user_id=" + userId, {
                        headers: {'client-id':clientId,'Authorization':'Bearer ' + response.data.access_token}
                    }).then(function success(response) {
                        var newCount = ["" + response.data.data.length.toString() + ""];
                        var newInt = parseInt(newCount[0]);
                        var oldInt = parseInt($scope.subscribers[0]);

                        //float changing number
                        if (newInt>oldInt) {
                            $scope.floatText("+" + (newInt - oldInt).toString(),$("#subscribers")[0],12);
                        } else if (newInt<oldInt) {
                            $scope.floatText("-" + (oldInt - newInt).toString(),$("#subscribers")[0],12);
                        }

                        $scope.subscribers = newCount; 
                    }, function error(response) {
                        console.log("ERROR: Subscription Count Broke.")
                    });

                    //get viewer count
                    $http.get("https://api.twitch.tv/helix/streams?user_id=" + userId, {
                        headers: {'client-id':clientId,'Authorization':'Bearer ' + response.data.access_token}
                    }).then(function success(response) {
                        var newCount;
                        if (response.data.data.length == 0) {
                            newCount = ["0"];
                        } else {
                            newCount = ["" + response.data.data[0].viewer_count.toString() + ""]
                        }
                        var newInt = parseInt(newCount[0]);
                        var oldInt = parseInt($scope.viewers[0]);
                        
                        if (newInt>oldInt) {
                            $scope.floatText("+" + (newInt - oldInt).toString(),$("#viewers")[0],12);
                        } else if (newInt<oldInt) {
                            $scope.floatText("-" + (oldInt - newInt).toString(),$("#viewers")[0],12);
                        }

                        $scope.viewers = newCount;
                    }, function error(response) {
                        console.log("ERROR: Viewer Count Broke.")
                    });

                    //get follower count
                    $http.get("https://api.twitch.tv/helix/users/follows?to_id=" + userId, {
                        headers: {'client-id':clientId,'Authorization':'Bearer ' + response.data.access_token}
                    }).then(function success(response) {
                        var newCount = ["" + response.data.total + ""];

                        var newInt = parseInt(newCount[0]);
                        var oldInt = parseInt($scope.followers[0]);

                        if (newInt>oldInt) {
                            $scope.floatText("+" + (newInt - oldInt).toString(),$("#followers")[0],12);
                        } else if (newInt<oldInt) {
                            $scope.floatText("-" + (oldInt - newInt).toString(),$("#followers")[0],12);
                        }

                        $scope.followers = newCount;
                    }, function error(response) {
                        console.log("ERROR: Follower Count Broke.")
                    });
                    
                }, function error(response) {
                    console.log("ERROR: Get OATH Broke.")
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

            $scope.floatText("+" + $scope.getIncrementAsString(),$("#number")[0], 24);
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

        $scope.floatText = function(float, element, textSize) {
            var newFloater = document.createElement("div");
            var newFloaterId = "textFloater" + $scope.floaterCount;
            newFloater.setAttribute("id", newFloaterId);
            newFloater.setAttribute("class", "floatingText");
            newFloater.style.fontSize = textSize;
            $scope.floaterCount++;
      
            var text = document.createTextNode(float);
            newFloater.appendChild(text);                  
      
            element.appendChild(newFloater);
      
            anime({
              targets: "#" + newFloaterId,
              translateY: -100,
              duration: 1000,
              easing: 'linear',
              opacity: 0,
            });
      
            //remove element
            $timeout(function() {
              element.removeChild(newFloater);
            }, 1000);
        }

        $scope.getNumberPerSecond = function() {
            return $scope.calculateIncrement() / (1000 - $scope.delayInMS);
        }
        
        $interval($scope.pullFromTwitch, 5000);   
        $interval($scope.incrementNumber, $scope.delayInMS);  

        $scope.pullFromTwitch();

        
        increaseSpeed = function(speed) {
            $scope.delayInMS = speed;
        }
});
