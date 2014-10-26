angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('Friends', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var friends = [
            {id: 0, name: 'Scruff McGruff'},
            {id: 1, name: 'G.I. Joe'},
            {id: 2, name: 'Miss Frizzle'},
            {id: 3, name: 'Ash Ketchum'}
        ];

        return {
            all: function () {
                return friends;
            },
            get: function (friendId) {
                // Simple index lookup
                return friends[friendId];
            }
        }
    })
    .factory('bluetooth',['$http', function($http) {

        var userSSID = null;
        var userMACAddress = null;
        var userToken = $("#token").val();
        var scanTimer = null;
        var connectTimer = null;
        var reconnectTimer = null;

        function initializeSuccess(obj) {

            if (obj.status == "enabled")
            {
                userSSID = obj.ssid;
                userMACAddress = obj.macAddress;
                console.log("Bluetooth initialized successfully, starting scanning for devices.");
                scanTimer = setTimeout(scanTimeout, 5000);
            }
            else
            {
                console.log("Unexpected initialize status: " + obj.status);
            }
        }

        function initializeError(obj)
        {
            console.log("Initialize error: " + obj.error + " - " + obj.message);
        }

        function sendToServer(obj){
            var userToken = $("#token").html();
            var ssidName = obj.deviceSSID;
            var macAddress = obj.address;
            var latitude = obj.latitude;
            var longitude = obj.longitude;
            var url = 'https://ilancaster.herokuapp.com/bluetooth/add?SSID='+ssidName+'&mac='+macAddress+
                'longitude='+longitude+'&latitude='+latitude+'&token='+userToken;
            $http.post(url);
            alert(url);
        }

        function startScanSuccess(obj)
        {
            if (obj.status == "scanResult") {
                bluetoothle.stopScan(stopScanSuccess, stopScanError);
                clearScanTimeout();
                sendToServer(obj);
                scanTimer = setTimeout(scanTimeout, 5000);
            }
            else if (obj.status == "scanStarted")
            {
                console.log("Scan was started successfully");
                scanTimer = setTimeout(scanTimeout, 5000);
            }
            else
            {
                console.log("Unexpected start scan status: " + obj.status);
            }
        }

        function startScanError(obj)
        {
            console.log("Start scan error: " + obj.error + " - " + obj.message);
        }

        function scanTimeout()
        {
            console.log("Scanning time out, stopping");
            alert("Start");
            bluetoothle.startScan(startScanSuccess, startScanError, {});
            //bluetoothle.stopScan(stopScanSuccess, stopScanError);
        }

        function clearScanTimeout()
        {
            console.log("Clearing scanning timeout");
            if (scanTimer != null)
            {
                clearTimeout(scanTimer);
            }
        }

        function stopScanSuccess(obj)
        {
            if (obj.status == "scanStopped")
            {
                console.log("Scan was stopped successfully");
            }
            else
            {
                console.log("Unexpected stop scan status: " + obj.status);
            }
        }

        function stopScanError(obj)
        {
            console.log("Stop scan error: " + obj.error + " - " + obj.message);
        }

        function startService(){

            bluetoothle.initialize(initializeSuccess, initializeError);

        }

        return {
            startBluetooth: function() {
                startService();
            }
        };
    }])


    .service('playlistService', function ($http) {
        var playlists = [];


        var addPlaylistData = function (newObj) {
            playlists.push(newObj);
        }


        var getPlaylistData = function (id) {
            for (var i = 0; i < playlists.length; i++) {
                if (playlists[i].playlistID === id) {
                    return playlists[i];
                }
            }

        }

        return {
            addPlaylistData: addPlaylistData,
            getPlaylistData: getPlaylistData

        };


    });