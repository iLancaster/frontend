angular.module('starter.controllers', [])


    .controller('PlaylistsCtrl', function ($scope, $state, playlistService, $http, $ionicSlideBoxDelegate, bluetooth) {
        //alert(window.token)
        $scope.$state = $state;

        bluetooth.startBluetooth();
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


        $scope.toStats = function (playlist) {
            console.log(playlist)
            $state.go("tab.stats", {
                'id': playlist.playlistID
            })
        }

        $scope.toMoreInfo = function (playlist) {
            console.log("!!")
            console.log(playlist)
            console.log(playlist.playlistID)
            $state.go("tab.playlistinfo", {
                'id': playlist.playlistID
            })
        }


        var token = $('#token').html();
        $http.get('https://ilancaster.herokuapp.com/playlist?token=' + token).success(function (data, status) {
            if (data === []) {
                $scope.playlists = [{"title": "Nothing Here :(", "image": ""}]
                $ionicSlideBoxDelegate.update();
            } else {
                $scope.playlists = data;
                $ionicSlideBoxDelegate.update();
            }

            if ($scope.playlists.length != 0) {
                for (i = 0; i < $scope.playlists.length; i++) {
                    playlistService.addPlaylistData($scope.playlists[i]);
                }
            }
        })

    })


    .controller('StatsCtrl', function ($scope, $ionicSlideBoxDelegate, $state, $stateParams, playlistService) {


        console.log(playlistService.getPlaylistData($stateParams.id))

        var thisPlaylist = playlistService.getPlaylistData($stateParams.id)

        $scope.nextSlide = function () {
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
                text: 'Genres in ' + thisPlaylist.title
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

    .controller('PlaylistInfoCtrl', function ($scope, $state, $stateParams, playlistService, $http, $ionicLoading) {

         $scope.play = function (id,vidURL){
             var allAudioEls = $('audio');
             allAudioEls.each(function() {
                 var a = $(this).get(0);
                 a.pause();
             });


             var myVideo = document.getElementById(id);
             console.log(myVideo)
             myVideo.src = vidURL;
             myVideo.play();

        }
        var token = $('#token').html();
        $ionicLoading.show({
            template: 'Loading...'
        });
        $http.get('https://ilancaster.herokuapp.com/playlist/p?id=' + $stateParams.id + '&token=' + token).success(function (data, status) {

            // $scope.playlistsSongs = playlistService.getPlaylistData($stateParams.id);

            console.log('look gere')
            console.log(data)

            $scope.items = data.items;
            $ionicLoading.hide();
        })
    })
    .controller('LastFmCtrl', function ($scope, $state, $stateParams, $http) {
        $scope.lastFMAuth = function () {
            var token = $('#token').html();
            $http.post('https://ilancaster.herokuapp.com/lastfm/login?token=' + token)
                .success(function (data, status) {
                    var auth = window.open(data, '_blank', 'location=yes');
                    $state.go("tab.playlists")
                })
        }
    })

    .controller('SignInCtrl', function ($scope, $state, $ionicModal, $http, $stateParams) {
        $scope.regData = {};
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.closeReg = function () {
            $scope.modal.hide();
        };
        $scope.showReg = function () {
            console.log('Show')
            $scope.modal.show();
        };
        $scope.doReg = function () {
            var user = $scope.regData;
            $http.post('https://ilancaster.herokuapp.com/api/register?username=' + user.username + '&password=' + user.password).success(function (data, status) {

                var token = data.token;

                console.log(data)
                console.log(token)
                $http.post('https://ilancaster.herokuapp.com/spotify/login?token=' + data.token).success(function (data, status) {
                    console.log('here', data)
                    var auth = window.open(data, '_blank', 'location=yes');

                    $state.go("lastfm")

                    $scope.modal.hide();

                })
            })


        };

        $scope.signIn = function (user) {
            console.log('Sign-In', user.username);
            console.log('Sign-In', user.password);
            console.log('Sign-In', user.spotifyUsername);
            $http.post('https://ilancaster.herokuapp.com/api/login?username=' + user.username + '&password=' + user.password).success(function (data, status) {
                console.log(data, status)
                if (!data.token) {
                    alert('error!')
                } else {
                    $('#token').html(data.token)
                    $state.go('tab.playlists');
                }
            })


        };

    })