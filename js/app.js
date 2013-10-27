/*jslint node: true, nomen: true, vars: true */
/*global Parse, angular, alert, OpeningHoursModule, window */

'use strict';

var myApp = angular.module('myApp', ['ui.bootstrap', 'ngSanitize']);

var OpeningHours = OpeningHoursModule.OpeningHours;
var OpeningHoursFormatter = OpeningHoursModule.OpeningHoursFormatter;
var openingHoursFormatter = new OpeningHoursFormatter({
    separator: " - "
});

myApp.controller('AppController', ['$scope', function ($scope) {

    function getUsersGeoLocation() {
        Parse.GeoPoint.current({
            success: function (position) {
                $scope.$apply(function () {
                    $scope.position = position;
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    Parse.initialize("4DECQGbsZc1JkVLi02vuTlRdCaqmB49RC4EDaSIV", "kj3nbsej35OJXCIX1AlV1ILZH8rx8DIqLa1W6g4y");

    var HealthService = Parse.Object.extend("HealthService");

    function getHealthServices() {
        var query = new Parse.Query(HealthService);
        query.limit(999);
        query.find({
            success: function (results) {
                $scope.$apply(function () {
                    $scope.healthServices = results.map(function (obj) {
                        return {
                            displayName: obj.get("HealthServiceDisplayName"),
                            parseObject: obj,
                            place: obj.get("VisitAddressPostName"),
                            address: obj.get("VisitAddressStreet"),
                            phone: obj.get("HealthServicePhone"),
                            externalUrl: obj.get("HealthServiceWeb"),
                            hasExternalUrl: obj.get("HealthServiceWeb") !== null,
                            openingHours: new OpeningHours(obj.get("SmartOpeningHours")),
                            geoPoint: obj.get("geoPoint"),
                            distance: obj.get("geoPoint").kilometersTo($scope.position),
                            shouldHideDetails: true
                        };
                    });
                });
            },
            error: function (error) {
                alert('Error: ' + error.code + " " + error.message);
            }
        });
    }

    getUsersGeoLocation();
    getHealthServices();


    $scope.isOpen = function (obj) {
        return obj.openingHours.isOpen();
    };

    $scope.formattedOpeningHours = function (obj) {
        return openingHoursFormatter.formattedOpeningHours(obj.openingHours);
    };

}]);
