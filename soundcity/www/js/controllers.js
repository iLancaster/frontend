angular.module('starter.controllers', [])




.controller('PlaylistsCtrl', function($scope,$state) {
    //alert(window.token)
        $scope.$state = $state;
        /*
        startScanSuccessCallback = function(scanResult){

                alert(scanResult.address)

        }

        startScanErrorCallback = function(){
                alert('errorstarting scan')

        }

        initializeSuccessCallback = function() {
            bluetoothle.startScan(startScanSuccessCallback, startScanErrorCallback, {});
        }

        initializeErrorCallback = function(e){
            alert(e)
        }

        var params = {"request":true}


        bluetoothle.initialize(initializeSuccessCallback, initializeErrorCallback, params);

    */





                $scope.toStats = function(playlist){
            console.log(playlist)
            $state.go("tab.stats", {'title':playlist.title ,
                                   'song':playlist.song})
        }

    $scope.playlists = [{
            title: "Manchester",
            songs: ["Song 1", "Song2"]

        }, {
        title: "London",
        songs: ["Song 1", "Song2"]

    }]

})


.controller('StatsCtrl', function($scope, $ionicSlideBoxDelegate,$state,$stateParams) {


    console.log($stateParams.title)
        console.log($stateParams.song)
    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    }
    $scope.chart = {
        options: {
            chart: {
                type: 'pie',
                spacingBottom: 150

            }
        },

        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        title: {
            text: 'Genres in '+ $stateParams.title
        },

        loading: false
    }

    $scope.chart2 = {
        options: {
            chart: {
                type: 'pie',
                spacingBottom: 150

            }
        },

        series: [{
            data: [3, 8, 24, 48, 7]
        }],
        title: {
            text: 'Other stats'
        },

        loading: false
    }


})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('LastFmCtrl', function($scope,$state,$stateParams,$http) {
	

    $scope.lastFMAuth = function(){
    	//alert('authing')
    	var token = $('#token').html();
    	//alert(token)
    	//alert("https://ilancaster.herokuapp.com/lastfm/login?token="+token)
		 $http.post('https://ilancaster.herokuapp.com/lastfm/login?token='+token)

		 .success(function(data, status) {
                
                //alert(data)
                var auth = window.open(data, '_blank', 'location=yes'); 
                
               // alert($('#token').html(token))
                //$rootScope.token = token
               	$state.go("tab.playlists")

               // $scope.modal.hide();

            })
		 
    }
})

.controller('SignInCtrl', function($scope, $state, $ionicModal, $http,$stateParams) {
    $scope.regData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeReg = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.showReg = function() {
        console.log('Show')
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doReg = function() {

        var user = $scope.regData;
        $http.post('https://ilancaster.herokuapp.com/api/register?username=' + user.username + '&password=' + user.password).success(function(data, status) {
            //alert(status)

            var token = data.token;
            //window.token = token;
            //alert(token)
            console.log(data)
            console.log(token)
            $http.post('https://ilancaster.herokuapp.com/spotify/login?token=' + data.token).success(function(data, status) {
                console.log('here', data)
                var auth = window.open(data, '_blank', 'location=yes'); 
                
                //alert($('#token').html(token))
                //$rootScope.token = token
               	$state.go("lastfm")

                $scope.modal.hide();

            })
        })
 

    };

    $scope.signIn = function(user) {
        console.log('Sign-In', user.username);
        console.log('Sign-In', user.password);
        console.log('Sign-In', user.spotifyUsername);
        $http.post('https://ilancaster.herokuapp.com/api/login?username=' + user.username + '&password=' + user.password).success(function(data, status) {
            console.log(data, status)
            if(!data.token){
            	alert('error!')
            } else {
            	$('#token').html(data.token)
            	$state.go('tab.playlists');
            }
        })


        
    };

})