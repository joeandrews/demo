'use strict';
angular.module('demo').controller('AccountCtrl', ['$scope', 'Auth', '$location', '$routeParams', 'Restangular',

	function($scope, Auth, $location, $routeParams, Restangular) {
		if (!Auth.isLoggedIn()) {
			$location.path('/login');

		};
		Restangular.setDefaultHttpFields({
			withCredentials: true
		});
		$scope.webProperties = [];
		Restangular.one('user/account/' + $routeParams.accountID).get().then(function(accounts) {
			$scope.accountProperties = accounts.items;
		}, function(e) {
			console.log('error', e);
		});

	}
]);