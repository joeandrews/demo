'use strict';
angular.module('demo').controller('DashboardCtrl', ['$scope', 'Auth', '$location',

	function($scope, Auth, $location) {
		if (!Auth.isLoggedIn()) {
			$location.path('/login');

		};
		$scope.user = Auth.currentUser();
	}
]);