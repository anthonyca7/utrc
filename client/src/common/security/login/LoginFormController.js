angular.module('security.login.form', [])

	.controller('LoginFormController', [
		'$scope', '$modalInstance', 'security', function ($scope, $modalInstance, security) {
			$scope.user = {};
			$scope.authError = null;

			$scope.authReason = null;
			if (security.getLoginReason()) {
				$scope.authReason = ( security.isAuthenticated() ) ?
					"You are not authorized" :
					"You need to sign in to continue";
			}

			$scope.login = function () {
				$scope.authError = null;
				security.login($scope.user.username, $scope.user.password).then(function (loggedIn) {
					if (!loggedIn) {
						$scope.authError = "Invalid username or password";
					}
					else {
						$modalInstance.close(true);
					}
				}, function (x) {
					$scope.authError = "Invalid username or password";
				});
			};

			$scope.clearForm = function () {
				$scope.user = {};
			};

			$scope.cancelLogin = function () {
				$modalInstance.dismiss();
			};
		}
	]);
