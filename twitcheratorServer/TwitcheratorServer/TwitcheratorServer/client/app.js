var app = angular.module('myApp', []);

app.controller('myCtrl',function($scope, $interval, $http, $timeout) {
    $scope.youWin = false;

    $scope.data = {
        viewers: 0,
        followers: 0,
        subscribers: 0,
        bitsInLast5: 0,
        increment: "0",
        number: "0"
    };

    $scope.auth = {
        client_id: "eo171si6zugwlanaf2it4wuo3mg6y7",
        client_secret: "1u9f21tz495eg388gu7ads9rok69nl",
        user_id: 452018475,
        code: "",
        token: "",
        refresh_token: "",
    };

    $scope.startingFontSize = 32;

    $scope.bitLog = [];


    $scope.socketOpen = false;
    $scope.isListening = false;

    $scope.loading = true;
    $scope.bitSocket;
    $scope.chatSocket;
    $scope.chatClient;

    $scope.displayChatMessage = false;
    $scope.displayBitsMessage = false;

    var heartbeatHandle;
    var heartbeatInterval = 60000;
    var reconnectInterval = 3000;

    $(function () {
        var hub = $.connection.twitchHub;

        hub.client.receiveMessage = $scope.receiveMessage;   

        $.connection.hub.start();

        var x = $scope.getUrlVars()["code"];

        if (x) {
            $scope.auth.code = x;

            $scope.getAuthToken();
        }

        $scope.loadNumber();
    });

    $scope.getUrlVars = function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    $scope.heartbeat = function () {
        console.log("BITS - PING");

        message = {
            type: 'PING'
        };

        $scope.bitSocket.send(JSON.stringify(message));
    }

    $scope.addBits = function (bits) {
        $scope.bitLog.push({bits: bits, date: new Date()})
    }

    $scope.getBitsInLast5 = function () {
        var filtered = $scope.bitLog.filter(log => log.date >= (new Date() - 5 * 60 * 1000));

        var sum = filtered.reduce((a, b) => a + (b['bits'] || 0), 0);

        return sum;
    }

    $scope.onOpen = function () {
        console.log("BITS - OPEN");
        $scope.heartbeat();

        heartbeatHandle = setInterval($scope.heartbeat, heartbeatInterval);
        $scope.displayBitsMessage = true;
    }

    $scope.onMessage = function (message) {
        console.log("BITS - " + message.type.toUpperCase() + (JSON.parse(message.data).topic ? " - " + JSON.parse(message.data).topic : "") + (JSON.parse(message.data).type ? " - " + JSON.parse(message.data).type : ""));
        if (message.type.toUpperCase() == "MESSAGE") {
            if (JSON.parse(message.data).topic == "channel-bits-events-v2.452018475") {
                var data = JSON.parse(JSON.parse(message.data).message).data;

                $scope.addBits(data.bits_used);
            }
        }

        if (message.type.toUpperCase() == 'RECONNECT') {
            setTimeout($scope.openBitsSocket, reconnectInterval);
        }

        if (!$scope.isListening && JSON.parse(message.data).type.toUpperCase() == "PONG") {
            $scope.listen();
            $scope.isListening = true;
        }
    }

    $scope.onClose = function () {
        console.log("BITS - CLOSE");

        clearInterval(heartbeatHandle);

        $scope.isListening = false;

        setTimeout($scope.openBitsSocket, reconnectInterval);

        $scope.displayBitsMessage = false;
    }

    $scope.onError = function (error) {
        console.log("BITS - ERROR");
        console.log(error);
    }

    $scope.getAuthURL = function () {
        var url = 'https://id.twitch.tv/oauth2/authorize' +
            '?response_type=code' +
            '&client_id=' + $scope.auth.client_id +
            '&redirect_uri=http://localhost:63049/client/index.html' +
            '&scope=chat:read+bits:read';

        return url;
    }

    $scope.refreshInterval;

    $scope.getAuthToken = function () {
        //get auth token
        $http.post("https://id.twitch.tv/oauth2/token?client_id=" + $scope.auth.client_id + "&client_secret=" + $scope.auth.client_secret + "&code=" + $scope.auth.code + "&grant_type=authorization_code&redirect_uri=http://localhost:63049/client/index.html")
            .then(function success(response) {
                $scope.auth.token = response.data.access_token;
                $scope.auth.refresh_token = response.data.refresh_token;

                var refreshIn = (response.data.expires_in - 60) * 1000;
                $scope.refreshInterval = $interval($scope.refreshToken, refreshIn);
                $scope.openBitsSocket();
                $scope.openChatSocket();
            }, function error(response) {
                debugger;
            });
    }


    $scope.refreshToken = function () {
        clearInterval($scope.refreshInterval);

        $http.post("https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=" + $scope.auth.refresh_token + "&client_id=" + $scope.auth.client_id + "&client_secret=" + $scope.auth.client_secret)
            .then(function success(response) {
                $scope.auth.token = response.data.access_token;
                $scope.auth.refresh_token = response.data.refresh_token;

                var refreshIn = (response.data.expires_in - 60) * 1000;
                $scope.refreshInterval = $interval($scope.refreshToken, refreshIn);
            }, function error(response) {
                debugger;
            });
    }

    $scope.openBitsSocket = function () {
        $scope.bitSocket = new WebSocket("wss://pubsub-edge.twitch.tv");
        $scope.bitSocket.onopen = $scope.onOpen;
        $scope.bitSocket.onmessage = $scope.onMessage;
        $scope.bitSocket.onclose = $scope.onClose;
        $scope.bitSocket.onerror = $scope.onError;
    }

    $scope.openChatSocket = function () {
        $scope.chatSocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
        $scope.chatSocket.onopen = $scope.onChatOpen;
        $scope.chatSocket.onmessage = $scope.onChatMessage;
        $scope.chatSocket.onclose = $scope.onChatClose;
        $scope.chatSocket.onerror = $scope.onChatError;
    }

    $scope.onChatOpen = function () {
        console.log("CHAT - OPEN");
        $scope.chatSocket.send("PASS oauth:" + $scope.auth.token);
        $scope.chatSocket.send("NICK twitchmakesabignumber");
        $scope.chatSocket.send("JOIN #twitchmakesabignumber");

        $scope.displayChatMessage = true;

    }
    $scope.onChatMessage = function (message) {
        console.log("CHAT - " + message.data);

        if (message.data.includes("PRIVMSG")) {
            $scope.handleChat();
        }

        if (message.data.includes("PING :tmi.twitch.tv")) {        
            $scope.chatSocket.send("PONG :tmi.twitch.tv");
            console.log("CHAT - PONG");
        }
    }
    $scope.onChatClose = function () {
        console.log("CHAT - CLOSE");
        setTimeout($scope.openChatSocket, reconnectInterval);
        $scope.displayChatMessage = false;
    }
    $scope.onChatError = function (error) {
        console.log("CHAT - ERROR");
        console.log(error);   

    }

    $scope.listen = function () {
        message = {
            type: 'LISTEN',
            data: {
                topics: ["channel-bits-events-v2.452018475"],
                auth_token: $scope.auth.token
            }
        };

        $scope.bitSocket.send(JSON.stringify(message));
    }


    $scope.receiveMessage = function (newData) {

        $scope.loading = false;

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

    $scope.loadNumber = function () {
        if (localStorage.getItem("BigAssNumber")) {
            $scope.data.number = localStorage.getItem("BigAssNumber");
        }        
    }

    $scope.saveNumber = function () {
        localStorage.setItem("BigAssNumber", $scope.data.number);
    }

    $scope.deleteNumber = function () {
        localStorage.removeItem("BigAssNumber");
        location.reload();
    }

    $scope.tick = function() {
        if ($scope.incrementToAdd != "0" && !$scope.loading) {
            if ($scope.incrementToAdd.replace(",", "").replace("0", "").replace("0", "").replace("0", "").replace("0", "").replace("0", "").length == 0) {
                return;
            }
            $scope.data.number = bigAddStr($scope.data.number, $scope.incrementToAdd);     
            $scope.floatText("+" + $scope.incrementToAdd,$("#floaterContainer")[0], 24, false);
            $scope.incrementToAdd = "0";   

            $scope.saveNumber();
        }        

        $scope.data.bitsInLast5 = $scope.getBitsInLast5();
        var el = $("#floaterContainer")[0];
        if (!$scope.loading && el.getBoundingClientRect().top <= 0 && $scope.auth.token != "") {
            $scope.startingFontSize -= 1;

            if ($scope.startingFontSize == 0) {
                $scope.youWin = true;
            }

            el.style.fontSize = $scope.startingFontSize;
            console.log("Resizing - Font Size: " + $scope.startingFontSize.toString());
        }
    }

    $scope.floatText = function (float, element, textSize, atParent) {
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
        var toAdd = getPointOnePercent($scope.data.number);
        $scope.data.number = bigAddStr($scope.data.number, toAdd);        
        $scope.floatText("+" + toAdd, $("#floaterContainer")[0], 24);

        $scope.bitLog.push({ bits: 1, date: new Date() });
    }

    $scope.addViewer = function() {           
        $scope.recieveUpdate();
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
