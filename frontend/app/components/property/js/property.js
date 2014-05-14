'use strict';
angular.module('demo').controller('PropertyCtrl', ['$scope', 'Auth', '$location', '$routeParams', 'Restangular',

	function($scope, Auth, $location, $routeParams, Restangular) {
		if (!Auth.isLoggedIn()) {
			$location.path('/login');

		};
		Restangular.setDefaultHttpFields({
			withCredentials: true
		});

		$scope.webProperties = [];
		$scope.config = {
			title: 'Page Views',
			tooltips: true,
			labels: false,
			mouseover: function() {},
			mouseout: function() {},
			click: function() {},
			legend: {
				display: true,
				//could be 'left, right'
				position: 'right'
			}
		};


		$scope.$watch($scope.data, function(d) {

		});
		$scope.changeData = function(timeFrame) {
			$scope.data = (function() {
				var xaxisMap = {
					'day': 'Yesterday - Today',
					'week': 'Last Week',
					'month': 'Last Month'
				};
				var data = {
					series: [],
					data: [{
						x: xaxisMap[timeFrame],
						y: []
					}]
				};
				for (var i = $scope[timeFrame].rows.length - 1; i >= 0; i--) {
					data.series.push($scope[timeFrame].rows[i][0]);
					data.data[0].y.push(parseInt($scope[timeFrame].rows[i][1]));
				};
				return data;
			})();
		};
		Restangular.one('user/property/' + $routeParams.propertyID).get().then(function(accounts) {
				$scope.week = accounts.week;
				$scope.month = accounts.month;
				$scope.day = accounts.day;
				$scope.changeData('week');

			},
			function(e) {
				console.log('error', e);
			});

	}
]);