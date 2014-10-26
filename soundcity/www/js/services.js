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