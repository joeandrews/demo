'use strict';

angular.module('demo-main', ['ngRoute'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'main/main.html',
				controller: 'HeaderCtrl'
			});
	})
	.controller('HeaderCtrl', ['$scope', 'Auth',
		function($scope, Auth) {
			$scope.Auth = Auth;


		}
	]);