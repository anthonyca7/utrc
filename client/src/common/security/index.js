// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.module', [
	'security.service',
	'security.interceptor',
	'security.login',
	'security.authorization'
]);
