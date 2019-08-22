var app = angular.module('myApp', []);

app.controller('myCtrl',function($scope, $interval, $http, $timeout) {

    $scope.data = {
        viewers: 1,
        followers: 1,
        subscribers: 1,
        bitsInLast5: 0,
        increment: "12345",
        number: "0"
    };

    $(function () {
        var chat = $.connection.twitchHub;

        chat.client.hello = function(test) {
            alert("yay~");
        };

        $.connection.hub.start().done(function () {
            $('#sendmessage').click(function () {                
                chat.server.hi();                
            });
        });
    });
    $scope.recieveUpdates = function() {
        //recieve newData
        var newData = Object.assign({}, $scope.data);
        newData.viewers += 5;
        newData.followers += 2;
        newData.subscribers += 100;
        newData.bitsInLast5 += 100;
        

        if ($scope.data.viewers != newData.viewers) {
            var diff = newData.viewers - $scope.data.viewers;
            var sign = "+";
            if (diff < 0) {
                sign = "-";
            }
            $scope.floatText(sign + addCommas(diff.toString()),$("#viewers")[0], 16, true);
        }
        $scope.data.viewers = newData.viewers;

        if ($scope.data.followers != newData.followers) {
            var diff = newData.followers - $scope.data.followers;
            var sign = "+";
            if (diff < 0) {
                sign = "-";
            }
            $scope.floatText(sign + addCommas(diff.toString()),$("#followers")[0], 16, true);
        }
        $scope.data.followers = newData.followers;

        if ($scope.data.subscribers != newData.subscribers) {
            var diff = newData.subscribers - $scope.data.subscribers;
            var sign = "+";
            if (diff < 0) {
                sign = "-";
            }
            $scope.floatText(sign + addCommas(diff.toString()),$("#subscribers")[0], 16, true);
        }
        $scope.data.subscribers = newData.subscribers;

        $scope.data.bitsInLast5 = newData.bitsInLast5;
        $scope.data.increment = newData.increment;        

    }


    $scope.incrementToAdd = "0";
          
    $scope.floaterCount = 0;

    $scope.getIncrement = function() {
        return addCommas($scope.data.increment);
    }
 
    $scope.incrementNumber = function() {
        $scope.incrementToAdd = bigAddStr($scope.incrementToAdd,$scope.data.increment);
        
        //console.log("Adding " + $scope.incrementToAdd);
    }

    $scope.tick = function() {
        if ($scope.incrementToAdd != "0") {
            $scope.data.number = bigAddStr($scope.data.number, $scope.incrementToAdd);        
            $scope.floatText("+" + $scope.incrementToAdd,$("#floaterContainer")[0], 24, false);
            $scope.incrementToAdd = "0";   
            
            
            //$scope.floatText("+1",$("#viewers")[0], 16, true);
            //$scope.floatText("+1",$("#followers")[0], 16, true);
            //$scope.floatText("+1",$("#subscribers")[0], 16, true);
        }            
    }

    $scope.floatText = function(float, element, textSize, atParent) {
        var newFloater = document.createElement("div");
        var newFloaterId = "textFloater" + $scope.floaterCount;
        newFloater.setAttribute("id", newFloaterId);
        newFloater.setAttribute("class", "floatingText");
        newFloater.style.fontSize = textSize;
        $scope.floaterCount++;
    
        var text = document.createTextNode(float);
        newFloater.appendChild(text);                  
    
        if (atParent) {
            var off = offset(element);
            newFloater.style.position = "absolute";
            newFloater.style.left = element.offsetLeft + element.offsetWidth - (newFloater.innerText.length * 7.5);

            //newFloater.style.top = off.top - element.offsetTop; 
        } else {
            newFloater.style.width = "100%";
        }
        element.appendChild(newFloater);                    
    
        anime({
            targets: "#" + newFloaterId,
            translateY: -300,
            duration: 1000,
            easing: 'linear',
            opacity: 0,
        });
    
        //remove element
        $timeout(function() {
            element.removeChild(newFloater);
        }, 1000);
    }

    function offset(el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    $scope.calculateDisplaySpeed = function() {
        var spd = $scope.calculateSpeed().toString();

        if (spd == "1000") {
            return "1s";
        }

        while (spd.charAt(spd.length -1) == 0) {
            spd = spd.substring(0, spd.length-1);
        }

        return "." + spd + "s";
    }

    $scope.calculateSpeed = function() {
        var speed = 1000 - $scope.data.bitsInLast5;

        if (speed <= 0) {
            speed = 10;
        }

        return speed;
    }

    $interval($scope.incrementNumber, $scope.calculateSpeed());  
    $interval($scope.tick, 100);  

    $scope.getIncrementPerSecond = function() {
        var ps = bigMultiplyStr($scope.data.increment,(Math.floor(1000/$scope.calculateSpeed()*100)).toString());
        ps = getOnePercent(getBigNumberAsString(ps));
        return ps;
    }

    $scope.handleChat = function() {
        var toAdd = getOnePercent($scope.data.number);
        $scope.data.number = bigAddStr($scope.data.number, toAdd);        
        $scope.floatText("+" + toAdd,$("#floaterContainer")[0], 24);
    }

    $scope.addViewer = function() {           
        $scope.recieveUpdates();
    }

    $scope.getFollowers = function() {
        return addCommas($scope.data.followers.toString());
    }

    $scope.getViewers = function() {
        return addCommas($scope.data.viewers.toString());
    }

    $scope.getSubscribers = function () {
        return addCommas($scope.data.subscribers.toString());
    }
});
