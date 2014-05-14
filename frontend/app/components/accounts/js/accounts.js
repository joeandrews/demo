'use strict';
angular.module('demo').controller('AccountsCtrl', ['$scope', 'Auth', '$location', 'Restangular',

	function($scope, Auth, $location, Restangular) {
		if (!Auth.isLoggedIn()) {
			$location.path('/login');

		};
		Restangular.setDefaultHttpFields({
			withCredentials: true
		});
		$scope.accounts = [];
		Restangular.one('user/accounts').get().then(function(accounts) {
			$scope.accounts = accounts.items;
		}, function(e) {
			console.log('error', e);
		});

	}
]);