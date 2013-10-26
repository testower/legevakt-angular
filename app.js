/*jslint node: true, nomen: true, vars: true */
/*global Parse, angular, alert */

'use strict';

var myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.controller('AppController', ['$scope', function ($scope) {

    Parse.initialize("4DECQGbsZc1JkVLi02vuTlRdCaqmB49RC4EDaSIV", "kj3nbsej35OJXCIX1AlV1ILZH8rx8DIqLa1W6g4y");

    var HealthService = Parse.Object.extend("HealthService");

    function getHealthServices() {
        var query = new Parse.Query(HealthService);
        query.find({
            success: function (results) {
                $scope.$apply(function () {
                    $scope.healthServices = results.map(function (obj) {
                        return {
                            displayName: obj.get("HealthServiceDisplayName"),
                            parseObject: obj,
                            address: obj.get("VisitAddressStreet")
                                + " "
                                + obj.get("VisitAddressPostName"),
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

    getHealthServices();

}]);
