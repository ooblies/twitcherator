var app = angular.module('myApp', []);

app.controller('myCtrl',function($scope, $interval) {
   
    $scope.message = "waiting...";
    $scope.status = "Offline";
    $scope.errorMessage = "";

    $scope.socket;

    $scope.retryIn = 5;

    $scope.connect = function() {
        $scope.socket = new WebSocket('ws://localhost:11111');

        $scope.socket.addEventListener("message", function(event){
            console.log("message from the server: " + event);       
            $scope.message = event; 
        }); 
    
        $scope.socket.addEventListener("open", function(event){
            console.log("message from the server: " + event);       
            $scope.status = "Online"; 
        }); 
    
        $scope.socket.addEventListener("error", function(event){
            console.log("message from the server: " + event);       
            $scope.errorMessage = "Error from : " + event.target.url;
        });    
                
        $scope.retryIn = 5;    
    }
    
    $interval($scope.connect, 1000);  

});
    
