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
				value = $filter('date')(date, 'EEEE MM-dd-yyyy hh:mm:ss a');
				value = (value==='Wednesday 12-31-1969 04:00:00 PM') ?null:value
				return value;
			}
		};
	}]);