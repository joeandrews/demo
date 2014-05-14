angular.module('demo').factory('Auth', ['Restangular', '$location', '$q',
	function(Restangular, $location, $q) {
		var currentUser = null;

		return {
			login: function(credentials) {
				var defer = $q.defer();

				Restangular.setDefaultHttpFields({
					withCredentials: true
				});
				Restangular.all('login').post(credentials).then(function(u) {

					currentUser = u;
					defer.resolve(u);
				}, function(e) {
					defer.reject(e);
					console.log('error', e);
				});
				return defer.promise;
			},
			checkStatus: function(argument) {
				var defer = $q.defer();
				Restangular.setDefaultHttpFields({
					withCredentials: true
				});
				Restangular.one('session').get().then(function(u) {

					currentUser = u;
					defer.resolve(u);
				}, function(e) {
					defer.reject(e);
					console.log('error', e);
				});
				return defer.promise;
			},
			logout: function() {
				currentUser = undefined;
				Restangular.setDefaultHttpFields({
					withCredentials: true
				});
				return Restangular.one('logout').get().then(function(u) {
					currentUser = null;
					$location.path('/');
				}, function(e) {
					console.log(e);
				});
			},
			isLoggedOut: function() {
				return currentUser ? false : true;
			},
			isLoggedIn: function() {
				return currentUser ? true : false;
			},
			currentUser: function() {
				return currentUser;
			}
		};
	}
]);