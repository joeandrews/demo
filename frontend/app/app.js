'use strict';

angular.module('demo', ['ngRoute', 'demo-main', 'templates', 'restangular', 'ngSails', 'ui.bootstrap', 'angularCharts'])
	.config(function($routeProvider, RestangularProvider, $sailsProvider) {
		RestangularProvider.setBaseUrl('http://intense-ridge-2363.herokuapp.com');
		$routeProvider
			.when('/login', {
				templateUrl: 'components/login/templates/login.html',
				controller: 'LoginCtrl'
			})
			.when('/accounts', {
				templateUrl: 'components/accounts/templates/accounts.html',
				controller: 'AccountsCtrl'
			})
			.when('/account/:accountID', {
				templateUrl: 'components/accounts/templates/account.html',
				controller: 'AccountCtrl'
			})
			.when('/property/:propertyID', {
				templateUrl: 'components/property/templates/property.html',
				controller: 'PropertyCtrl'
			})
			.when('/dashboard', {
				templateUrl: 'components/dashboard/templates/dashboard.html',
				controller: 'DashboardCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

	}).controller("appCtrl", ['$scope',
		function($scope) {
			$scope.init = true;

		}
	])
	.controller("headerCtrl", ['$scope', 'Auth', '$location', '$sails',
		function($scope, Auth, $location, $sails) {

			$scope.Auth = Auth;
			$scope.loggedIn = false;
			$scope.$watch(Auth.isLoggedIn(), function(value) {
				if (value) {
					$scope.loggedIn = true;

				} else {
					$scope.loggedIn = false;

				}
			});
			Auth.checkStatus().then(function(u) {
				$scope.loggedIn = true;


			}, function() {
				console.log('please log in');
				$location.path('/');
			});
		}
	]);