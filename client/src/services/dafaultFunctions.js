angular.module('webinterface')
	.factory('defaultModifiers', [ '$filter', function($filter){
		return {
			arrays: function(value){
				if (angular.isArray(value)) {
					value = value.toString();
				}
				return value;

			},
			dates: function(value){
				var date = new Date(value);
				if (angular.isDate(date)) {
					value = $filter('date')(date, 'EEEE MM-dd-yyyy HH:mm:ss a');
				}
				return value;
			}
		};
	}]);